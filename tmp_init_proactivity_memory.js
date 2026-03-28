const fs=require('fs');
const path=require('path');
const home=process.env.HOME||'/data';
const p=path.join(home,'proactivity','memory.md');
if(fs.existsSync(p) && fs.readFileSync(p,'utf8').trim().length>0){
  console.log('memory.md already non-empty; skipping');
  process.exit(0);
}
const today=new Date().toISOString().slice(0,10);
const content = `# Proactivity Memory\n\n## Status\nstatus: ongoing\nversion: 1.0.1\nlast: ${today}\nintegration: complete\n\n## Activation Preferences\n- Default: be proactive only when it is clearly useful; otherwise stay quiet\n- Ask before any external, irreversible, public, or third-party-impacting action\n\n## Action Boundaries\n- Safe to do automatically: internal drafts, checks, local file organization, tool verification\n- Always ask: send messages, spend money, delete data, reschedule/commit\n\n## State Rules\n- session-state.md tracks current objective/blocker/next step\n- working-buffer.md is only for volatile breadcrumbs during long tasks\n\n## Heartbeat Behavior\n- Re-check active blockers and promised follow-ups\n- Only message when something changed or a decision is needed\n\n## Notes\n- (empty)\n\n---\n*Updated: ${today}*\n`;
fs.writeFileSync(p, content);
console.log('initialized', p);
