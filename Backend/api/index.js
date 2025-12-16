import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

dotenv.config();

const app = express();

// Promisify fs
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

// AI client - Using fetch API for Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

app.use(cors({
  origin: [
    'https://correct-schedule-flow-ai-frontend-c.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'   
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json({ limit:'10mb' }));
app.use(bodyParser.urlencoded({ extended:true, limit:'10mb' }));
app.use((req, res, next) => { console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`); next(); });

// Storage setup
const dataDir = process.env.VERCEL ? '/tmp/data' : path.resolve(process.cwd(), 'data');
const schedulesFile = path.join(dataDir, 'schedules.json');

function ensureDirs() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(schedulesFile)) fs.writeFileSync(schedulesFile, JSON.stringify({ schedules: [] }, null, 2), 'utf-8');
}

async function readSchedules() {
  try {
    ensureDirs();
    const raw = await readFileAsync(schedulesFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.schedules) ? parsed.schedules : [];
  } catch (e) { return []; }
}

async function writeSchedules(schedules) {
  ensureDirs();
  await writeFileAsync(schedulesFile, JSON.stringify({ schedules }, null, 2), 'utf-8');
}

// --- Helpers ---
function validateScheduleRequest(req, res, next) {
  const { tasks, userId } = req.body;
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0)
    return res.status(400).json({ error: 'Tasks must be a non-empty array' });
  if (tasks.some(t => typeof t !== 'string' || t.trim() === ''))
    return res.status(400).json({ error: 'All tasks must be non-empty strings' });
  if (userId && typeof userId !== 'string')
    return res.status(400).json({ error: 'userId must be string' });
  next();
}

function buildSchedulePrompt(tasks, category, purpose) {
  const cat = category ? `This schedule is for: ${category}. ` : '';
  const pur = purpose ? `Purpose: ${purpose}. ` : '';
  return `You are an intelligent schedule planner. ${cat}${pur}Tasks: ${tasks.join(", ")}. Return ONLY a valid JSON object with time slot keys like "6-7", "7-8", etc. up to "7-8PM" for days MONDAY through SUNDAY. Each time slot should map to an object with day keys. Example format: {"6-7": {"MONDAY": "Task1", "TUESDAY": "Task2", ...}, "7-8": {...}}`;
}

async function callGeminiAPI(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('No API key available');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function parseScheduleFromAI(responseText) {
  if (!responseText) throw new Error('Empty AI response');
  let text = responseText.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/```\s*$/i,'').trim();
  let jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in AI response');
  return JSON.parse(jsonMatch[0]);
}

function getDefaultSchedule(tasks) {
  const t1 = tasks[0] || 'Work', t2 = tasks[1] || 'Study', t3 = tasks[2] || 'Exercise';
  return {
    "6-7": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t3,"SUNDAY": "Rest"},
    "7-8": {"MONDAY": t2,"TUESDAY": t2,"WEDNESDAY": t2,"THURSDAY": t2,"FRIDAY": t2,"SATURDAY": t1,"SUNDAY": "Rest"},
    "8-9": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t3,"SUNDAY": t2},
    "9-10": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t2,"SUNDAY": t1},
    "10-11": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t1,"SUNDAY": t3},
    "11-12": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t2,"SUNDAY": t1},
    "12-1": {"MONDAY":"Break","TUESDAY":"Break","WEDNESDAY":"Break","THURSDAY":"Break","FRIDAY":"Break","SATURDAY":"Break","SUNDAY":"Break"},
    "1-2": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t3,"SUNDAY": t2},
    "2-3": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t1,"SUNDAY": t1},
    "3-4": {"MONDAY": t1,"TUESDAY": t1,"WEDNESDAY": t1,"THURSDAY": t1,"FRIDAY": t1,"SATURDAY": t2,"SUNDAY": t3},
    "4-5": {"MONDAY": t2,"TUESDAY": t2,"WEDNESDAY": t2,"THURSDAY": t2,"FRIDAY": t2,"SATURDAY": t1,"SUNDAY": t1},
    "5-6": {"MONDAY": t3,"TUESDAY": t3,"WEDNESDAY": t3,"THURSDAY": t3,"FRIDAY": t3,"SATURDAY": t3,"SUNDAY": t2},
    "6-7PM": {"MONDAY": t2,"TUESDAY": t2,"WEDNESDAY": t2,"THURSDAY": t2,"FRIDAY": t2,"SATURDAY": t1,"SUNDAY": t1},
    "7-8PM": {"MONDAY":"Rest","TUESDAY":"Rest","WEDNESDAY":"Rest","THURSDAY":"Rest","FRIDAY":"Rest","SATURDAY":"Rest","SUNDAY":"Rest"}
  };
}

// PDF generation
async function generatePDF(scheduleData, tasks) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      let buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(20).text('Weekly Timetable', { align: 'center' }).moveDown(0.5);
      doc.fontSize(10).text(`Tasks: ${tasks.join(' • ')}`, { align: 'center' }).moveDown(1);

      const timeSlots = ['6-7','7-8','8-9','9-10','10-11','11-12','12-1','1-2','2-3','3-4','4-5','5-6','6-7PM','7-8PM'];
      const days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
      const startX = 50, startY = doc.y, timeColWidth = 50, dayColWidth = 65, rowHeight = 20, totalWidth = timeColWidth + dayColWidth*7;

      doc.lineWidth(1).rect(startX, startY, totalWidth, rowHeight*(timeSlots.length+1)).stroke();
      doc.rect(startX, startY, totalWidth, rowHeight).fillAndStroke('#f0f0f0','#000');
      doc.fillColor('#000').fontSize(8).text('TIME', startX+2, startY+5, { width: timeColWidth-4, align: 'center' });
      days.forEach((day,i)=>doc.text(day,startX+timeColWidth+i*dayColWidth+2,startY+5,{width:dayColWidth-4,align:'center'}));

      doc.fontSize(7);
      timeSlots.forEach((slot,row)=>{
        const y = startY + rowHeight*(row+1)+3;
        doc.text(slot,startX+2,y,{width:timeColWidth-4,align:'center'});
        days.forEach((day,col)=>{
          const task = scheduleData[slot]?.[day] || 'Free';
          const t = task.length > 12 ? task.slice(0,10)+'..' : task;
          doc.text(t,startX+timeColWidth+col*dayColWidth+2,y,{width:dayColWidth-4,align:'center'});
        });
      });

      doc.end();
    } catch(e){ reject(e); }
  });
}

// Routes
app.get('/api/health', (req,res)=>res.json({status:'OK', timestamp:new Date().toISOString(), gemini: !!GEMINI_API_KEY}));

app.post('/api/generate-schedule', validateScheduleRequest, async (req,res)=>{
  const requestId = Date.now().toString();
  const { tasks, category, purpose } = req.body;
  let scheduleData;

  try {
    if(!GEMINI_API_KEY) {
      scheduleData = getDefaultSchedule(tasks);
    } else {
      const prompt = buildSchedulePrompt(tasks, category, purpose);
      const responseText = await callGeminiAPI(prompt);
      scheduleData = parseScheduleFromAI(responseText);
    }
  } catch(e){ 
    console.error('AI generation failed:', e);
    scheduleData = getDefaultSchedule(tasks); 
  }

  try {
    const pdfData = await generatePDF(scheduleData, tasks);
    res.set({
      'Content-Type':'application/pdf',
      'Content-Disposition':'attachment; filename="weekly_timetable.pdf"',
      'Content-Length': pdfData.length.toString(),
      'X-Request-ID': requestId
    });
    res.send(pdfData);
  } catch(e) {
    console.error('PDF generation failed:', e);
    res.status(500).json({error:'PDF generation failed', details:e.message});
  }
});

// Fallback
app.use((req,res)=>res.status(404).json({error:'Route not found', path:req.path}));

export default serverless(app);
