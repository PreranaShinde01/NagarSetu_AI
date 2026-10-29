import Counter from '../models/Counter.js';

export async function generateNextComplaintId(year = new Date().getFullYear()) {
  const counter = await Counter.findOneAndUpdate(
    { key: 'complaint', year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const seqStr = String(counter.sequence).padStart(6, '0');
  return `NGS-${year}-${seqStr}`;
}

export async function generateNextWorkOrderId(year = new Date().getFullYear()) {
  const counter = await Counter.findOneAndUpdate(
    { key: 'work_order', year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const seqStr = String(counter.sequence).padStart(6, '0');
  return `WO-${year}-${seqStr}`;
}

export async function generateNextEscalationId(year = new Date().getFullYear()) {
  const counter = await Counter.findOneAndUpdate(
    { key: 'escalation', year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const seqStr = String(counter.sequence).padStart(6, '0');
  return `ESC-${year}-${seqStr}`;
}

