const scenarioData={acquisition:{prompt:'面向目标客群完成内容生产、渠道投放、线索回收与商机转化。',output:'获客内容矩阵 + 可跟进线索',demo:{name:'内容获客演示图',stages:[['01 / AUDIENCE','目标客群信号',['行业画像','核心痛点','需求趋势']],['02 / GROWTH ENGINE','内容生产与投放',['内容矩阵','渠道匹配','互动优化']],['03 / LEAD CONVERSION','线索回收与转化',['意向识别','销售分发','转化复盘']]]},steps:[['01','客群洞察组','分析目标客户、核心痛点与转化机会'],['02','内容策划组','生成内容主题、素材结构与触达话术'],['03','投放优化组','匹配渠道与预算，持续监测有效互动'],['04','线索转化组','回收线索、识别意向并触发销售跟进']]}};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
let workflowTimer; const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; const scenarioKeys=Object.keys(scenarioData);
const hero=$('.hero');
if(hero&&!reduceMotion){
  document.documentElement.classList.add('hero-motion-ready');
  requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('is-ready')));
}else{hero?.classList.add('is-ready')}
function activateScenario(key){$$('.lab-tab').forEach(tab=>{const active=tab.dataset.scenario===key; tab.classList.toggle('active',active); tab.setAttribute('aria-selected',String(active))}); renderScenario(key)}
function renderWorkflowDemo(key){const demo=scenarioData[key].demo; const target=$('#workflow-demo'); if(!target)return; target.setAttribute('aria-label',demo.name); target.innerHTML=demo.stages.map((stage,index)=>`<div class="demo-stage"><span class="demo-stage-label">${stage[0]}</span><strong>${stage[1]}</strong><div class="demo-tags">${stage[2].map(tag=>`<span>${tag}</span>`).join('')}</div></div>${index<demo.stages.length-1?'<div class="demo-connector" aria-hidden="true"><i></i></div>':''}`).join('')}
function renderTimeline(key){const timeline=$('#lab-timeline'); if(!timeline)return; const data=scenarioData[key]; timeline.innerHTML=data.steps.map(step=>`<div class="timeline-step pending"><span class="step-num">${step[0]}</span><span class="step-indicator"></span><strong>${step[1]}</strong><small>${step[2]}</small></div>`).join('')+'<span class="workflow-runner" aria-hidden="true"></span>'}
function moveWorkflowRunner(index){const timeline=$('#lab-timeline'); const card=$$('#lab-timeline .timeline-step')[index]; const runner=$('.workflow-runner'); if(!timeline||!card||!runner)return; runner.style.width=`${card.offsetWidth}px`; runner.style.transform=`translateX(${card.offsetLeft}px)`}
function showWorkflowStep(key,index){const timeline=$('#lab-timeline'); if(!timeline)return; const data=scenarioData[key]; const complete=index>=data.steps.length; const current=complete?data.steps.length-1:index; $$('#lab-timeline .timeline-step').forEach((card,i)=>{const state=complete||i<current?'done':i===current?'active':'pending'; card.classList.remove('done','active','pending'); card.classList.add(state); const indicator=card.querySelector('.step-indicator'); if(indicator.dataset.state!==state){indicator.dataset.state=state; indicator.innerHTML=state==='done'?'<span class="step-check">✓</span>':state==='active'?'<span class="step-running" aria-label="执行中"><i></i></span>':''}}); moveWorkflowRunner(current); const status=$('.output-check'); if(status){status.textContent=complete?'✓ 已完成':`执行中 · ${current+1}/${data.steps.length}`; status.classList.toggle('complete',complete)} if(reduceMotion)return; clearTimeout(workflowTimer); if(complete){const nextKey=scenarioKeys[(scenarioKeys.indexOf(key)+1)%scenarioKeys.length]; workflowTimer=window.setTimeout(()=>activateScenario(nextKey),2000); return} workflowTimer=window.setTimeout(()=>showWorkflowStep(key,index+1),1400)}
function renderScenario(key){clearTimeout(workflowTimer); const data=scenarioData[key]; const content=$('.lab-content'); content.classList.remove('scenario-enter'); void content.offsetWidth; content.classList.add('scenario-enter'); const prompt=$('#scenario-prompt'); const output=$('#scenario-output'); if(prompt)prompt.textContent=data.prompt; if(output)output.textContent=data.output; if(!$('#workflow-demo')||!$('#lab-timeline'))return; renderWorkflowDemo(key); renderTimeline(key); requestAnimationFrame(()=>showWorkflowStep(key,reduceMotion?data.steps.length:0))}
$$('.lab-tab').forEach(tab=>tab.addEventListener('click',()=>activateScenario(tab.dataset.scenario))); activateScenario('acquisition');
const taskCenter=$('.openswarm-motion');
if(taskCenter&&!reduceMotion){
  const stages=$$('.motion-stage');
  const progress=taskCenter.querySelector('.motion-head>span b');
  const progressBar=taskCenter.querySelector('.motion-progress i');
  const workerBars=taskCenter.querySelectorAll('.motion-workers b i');
  const footer=taskCenter.querySelector('.motion-foot span');
  const footerTime=taskCenter.querySelector('.motion-foot small');
  const events=['新任务已完成需求接入','任务编排官已拆解 3 个子任务','3 位数字员工正在并行协作','交付物已完成核验并同步'];
  let activeStage=-1;
  const renderTaskCenter=()=>{
    stages.forEach((stage,index)=>{
      const state=stage.querySelector('.motion-stage-head em');
      stage.classList.toggle('is-active',index===activeStage);
      stage.classList.toggle('is-complete',index<activeStage);
      if(state)state.textContent=index<activeStage?'完成':index===activeStage?'执行中':'等待';
    });
    const percent=activeStage<0?0:(activeStage+1)*25;
    if(progress)progress.textContent=`${percent}%`;
    if(progressBar)progressBar.style.width=`${percent}%`;
    workerBars.forEach((bar,index)=>{bar.style.width=activeStage<1?'0%':activeStage===1?`${[46,63,78][index]}%`:'100%'});
    if(footer)footer.textContent=activeStage<0?'◯　等待新任务接入':`✧　${events[activeStage]}`;
    if(footerTime)footerTime.textContent=activeStage<0?'准备中':activeStage===3?'刚刚':'3 秒前';
  };
  renderTaskCenter();
  const advanceTaskCenter=()=>{window.setTimeout(()=>{if(activeStage===stages.length-1){activeStage=-1;renderTaskCenter();window.setTimeout(()=>{activeStage=0;renderTaskCenter();advanceTaskCenter()},650);return}activeStage+=1;renderTaskCenter();advanceTaskCenter()},1500)};
  window.setTimeout(()=>{activeStage=0;renderTaskCenter();advanceTaskCenter()},650);
}
const capabilitySection=$('#capabilities');
if(capabilitySection&&!reduceMotion&&'IntersectionObserver' in window){
  document.documentElement.classList.add('motion-ready');
  const capabilityObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');capabilityObserver.unobserve(entry.target)}})},{threshold:.16});
  capabilityObserver.observe(capabilitySection);
}else{capabilitySection?.classList.add('is-revealed')}
const revealTargets=$$('#position .section-head,#position .position-map,#products>.content-width>.eyebrow,#products .section-head,#products .product-grid,#products .foundation-row,#lab>.content-width>.eyebrow,#lab .section-head,#lab .lab-shell,#lab .growth-panel,.security-layout,.proof-section .eyebrow,.proof-section .section-head,.trust-evidence,.industry-row,.cta-inner');
if(revealTargets.length&&!reduceMotion&&'IntersectionObserver' in window){
  document.documentElement.classList.add('content-motion-ready');
  const contentObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');contentObserver.unobserve(entry.target)}})},{threshold:.14,rootMargin:'0px 0px -40px'});
  revealTargets.forEach(target=>{target.classList.add('content-reveal');contentObserver.observe(target)});
}else{revealTargets.forEach(target=>target.classList.add('is-visible'))}
const modal=$('#demo-modal'); function openModal(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>modal.querySelector('input')?.focus(),100)} function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''} $$('[data-open-demo]').forEach(b=>b.addEventListener('click',openModal)); $$('[data-close-demo]').forEach(b=>b.addEventListener('click',closeModal)); modal.addEventListener('click',e=>{if(e.target===modal)closeModal()}); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

const menu=$('.menu-toggle');menu.addEventListener('click',()=>{$('.main-nav').classList.toggle('open');menu.setAttribute('aria-expanded',$('.main-nav').classList.contains('open'))}); $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>$('.main-nav').classList.remove('open')));
const header=$('.site-header');
function syncHeaderState(){header?.classList.toggle('scrolled',window.scrollY>18)}
window.addEventListener('scroll',syncHeaderState,{passive:true});syncHeaderState();

const metricPanel=$('.trust-metrics');
function animateMetric(metric,delay){
  const value=Number((metric.textContent.match(/\d+/)||['0'])[0]);
  const suffix=metric.textContent.replace(/\d+/,'').trim();
  const suffixNode=document.createElement('span');
  suffixNode.textContent=suffix;
  metric.replaceChildren(document.createTextNode('0'),suffixNode);
  window.setTimeout(()=>{
    const startedAt=performance.now();
    const duration=1050;
    const tick=now=>{
      const progress=Math.min((now-startedAt)/duration,1);
      const eased=1-Math.pow(1-progress,4);
      metric.firstChild.nodeValue=String(Math.round(value*eased));
      if(progress<1){requestAnimationFrame(tick)}
    };
    requestAnimationFrame(tick);
  },delay);
}
if(metricPanel&&!reduceMotion&&'IntersectionObserver' in window){
  const metricsObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){$$('.trust-metrics strong').forEach((metric,index)=>animateMetric(metric,index*150));metricsObserver.unobserve(entry.target)}})},{threshold:.45});
  metricsObserver.observe(metricPanel);
}
