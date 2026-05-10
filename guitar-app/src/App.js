import { useState, useEffect, useRef, useCallback } from "react";

const STRINGS = ["E", "A", "D", "G", "B", "e"];

const CHORD_DB = {
  "C":    { frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], barre: null },
  "C#":   { frets: [-1,4,3,1,2,1], fingers: [0,4,3,1,2,1], barre: 1 },
  "Db":   { frets: [-1,4,3,1,2,1], fingers: [0,4,3,1,2,1], barre: 1 },
  "D":    { frets: [-1,-1,0,2,3,2], fingers: [0,0,0,1,3,2], barre: null },
  "D#":   { frets: [-1,-1,1,3,4,3], fingers: [0,0,1,2,4,3], barre: null },
  "Eb":   { frets: [-1,-1,1,3,4,3], fingers: [0,0,1,2,4,3], barre: null },
  "E":    { frets: [0,2,2,1,0,0], fingers: [0,3,2,1,0,0], barre: null },
  "F":    { frets: [1,1,2,3,3,1], fingers: [1,1,2,4,3,1], barre: 1 },
  "F#":   { frets: [2,2,3,4,4,2], fingers: [1,1,2,4,3,1], barre: 2 },
  "Gb":   { frets: [2,2,3,4,4,2], fingers: [1,1,2,4,3,1], barre: 2 },
  "G":    { frets: [3,2,0,0,0,3], fingers: [3,2,0,0,0,4], barre: null },
  "G#":   { frets: [4,3,1,1,1,4], fingers: [4,3,1,1,1,4], barre: 1 },
  "Ab":   { frets: [4,3,1,1,1,4], fingers: [4,3,1,1,1,4], barre: 1 },
  "A":    { frets: [-1,0,2,2,2,0], fingers: [0,0,2,1,3,0], barre: null },
  "A#":   { frets: [-1,1,3,3,3,1], fingers: [0,1,2,3,4,1], barre: 1 },
  "Bb":   { frets: [-1,1,3,3,3,1], fingers: [0,1,2,3,4,1], barre: 1 },
  "B":    { frets: [-1,2,4,4,4,2], fingers: [0,1,2,3,4,1], barre: 2 },
  "Am":   { frets: [-1,0,2,2,1,0], fingers: [0,0,3,2,1,0], barre: null },
  "A#m":  { frets: [-1,1,3,3,2,1], fingers: [0,1,3,4,2,1], barre: 1 },
  "Bbm":  { frets: [-1,1,3,3,2,1], fingers: [0,1,3,4,2,1], barre: 1 },
  "Bm":   { frets: [-1,2,4,4,3,2], fingers: [0,1,3,4,2,1], barre: 2 },
  "Cm":   { frets: [-1,3,5,5,4,3], fingers: [0,1,3,4,2,1], barre: 3 },
  "C#m":  { frets: [-1,4,6,6,5,4], fingers: [0,1,3,4,2,1], barre: 4 },
  "Dm":   { frets: [-1,-1,0,2,3,1], fingers: [0,0,0,2,3,1], barre: null },
  "D#m":  { frets: [-1,-1,1,3,4,2], fingers: [0,0,1,3,4,2], barre: null },
  "Em":   { frets: [0,2,2,0,0,0], fingers: [0,2,3,0,0,0], barre: null },
  "Fm":   { frets: [1,1,3,3,2,1], fingers: [1,1,3,4,2,1], barre: 1 },
  "F#m":  { frets: [2,2,4,4,3,2], fingers: [1,1,3,4,2,1], barre: 2 },
  "Gm":   { frets: [3,3,5,5,4,3], fingers: [1,1,3,4,2,1], barre: 3 },
  "G#m":  { frets: [4,4,6,6,5,4], fingers: [1,1,3,4,2,1], barre: 4 },
  "C7":   { frets: [-1,3,2,3,1,0], fingers: [0,3,2,4,1,0], barre: null },
  "D7":   { frets: [-1,-1,0,2,1,2], fingers: [0,0,0,3,1,2], barre: null },
  "E7":   { frets: [0,2,0,1,0,0], fingers: [0,2,0,1,0,0], barre: null },
  "F7":   { frets: [1,1,2,1,3,1], fingers: [1,1,2,1,4,1], barre: 1 },
  "G7":   { frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], barre: null },
  "A7":   { frets: [-1,0,2,0,2,0], fingers: [0,0,2,0,3,0], barre: null },
  "B7":   { frets: [-1,2,1,2,0,2], fingers: [0,2,1,3,0,4], barre: null },
  "Am7":  { frets: [-1,0,2,0,1,0], fingers: [0,0,2,0,1,0], barre: null },
  "Bm7":  { frets: [-1,2,4,2,3,2], fingers: [0,1,3,1,2,1], barre: 2 },
  "Cm7":  { frets: [-1,3,5,3,4,3], fingers: [0,1,3,1,2,1], barre: 3 },
  "Dm7":  { frets: [-1,-1,0,2,1,1], fingers: [0,0,0,3,1,1], barre: null },
  "Em7":  { frets: [0,2,0,0,0,0], fingers: [0,2,0,0,0,0], barre: null },
  "F#m7": { frets: [2,2,4,2,3,2], fingers: [1,1,3,1,2,1], barre: 2 },
  "Gm7":  { frets: [3,3,5,3,4,3], fingers: [1,1,3,1,2,1], barre: 3 },
  "Cmaj7":{ frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], barre: null },
  "Dmaj7":{ frets: [-1,-1,0,2,2,2], fingers: [0,0,0,1,2,3], barre: null },
  "Emaj7":{ frets: [0,2,1,1,0,0], fingers: [0,3,1,2,0,0], barre: null },
  "Fmaj7":{ frets: [-1,-1,3,2,1,0], fingers: [0,0,4,3,2,0], barre: null },
  "Gmaj7":{ frets: [3,2,0,0,0,2], fingers: [3,2,0,0,0,1], barre: null },
  "Amaj7":{ frets: [-1,0,2,1,2,0], fingers: [0,0,3,1,4,0], barre: null },
  "Csus2":{ frets: [-1,3,0,0,1,0], fingers: [0,2,0,0,1,0], barre: null },
  "Csus4":{ frets: [-1,3,3,0,1,1], fingers: [0,3,4,0,1,2], barre: null },
  "Dsus2":{ frets: [-1,-1,0,2,3,0], fingers: [0,0,0,1,3,0], barre: null },
  "Dsus4":{ frets: [-1,-1,0,2,3,3], fingers: [0,0,0,1,2,3], barre: null },
  "Esus4":{ frets: [0,2,2,2,0,0], fingers: [0,2,3,4,0,0], barre: null },
  "Asus2":{ frets: [-1,0,2,2,0,0], fingers: [0,0,2,3,0,0], barre: null },
  "Asus4":{ frets: [-1,0,2,2,3,0], fingers: [0,0,1,2,3,0], barre: null },
  "Adim": { frets: [-1,0,1,2,1,0], fingers: [0,0,1,3,2,0], barre: null },
  "Edim": { frets: [0,1,2,3,2,0], fingers: [0,1,2,4,3,0], barre: null },
  "Caug": { frets: [-1,3,2,1,1,0], fingers: [0,4,3,1,2,0], barre: null },
  "Eaug": { frets: [0,3,2,1,1,0], fingers: [0,4,3,1,2,0], barre: null },
  "Cadd9":{ frets: [-1,3,2,0,3,0], fingers: [0,3,2,0,4,0], barre: null },
  "Dadd9":{ frets: [-1,-1,0,2,3,0], fingers: [0,0,0,1,3,0], barre: null },
  "Gadd9":{ frets: [3,0,0,0,0,3], fingers: [2,0,0,0,0,3], barre: null },
  "E5":   { frets: [0,2,2,-1,-1,-1], fingers: [0,1,2,0,0,0], barre: null },
  "A5":   { frets: [-1,0,2,2,-1,-1], fingers: [0,0,1,2,0,0], barre: null },
  "D5":   { frets: [-1,-1,0,2,3,-1], fingers: [0,0,0,1,3,0], barre: null },
  "G5":   { frets: [3,5,5,-1,-1,-1], fingers: [1,3,4,0,0,0], barre: null },
  "B5":   { frets: [-1,2,4,4,-1,-1], fingers: [0,1,3,4,0,0], barre: null },
  "C5":   { frets: [-1,3,5,5,-1,-1], fingers: [0,1,3,4,0,0], barre: null },
};

const CHORD_ALIASES = {
  "C Mayor":"C","D Mayor":"D","E Mayor":"E","F Mayor":"F","G Mayor":"G","A Mayor":"A","B Mayor":"B",
  "A Minor":"Am","B Minor":"Bm","C Minor":"Cm","D Minor":"Dm","E Minor":"Em","F Minor":"Fm","G Minor":"Gm",
};

function resolveChord(name) {
  if (!name) return null;
  if (CHORD_DB[name]) return { key: name, data: CHORD_DB[name] };
  if (CHORD_ALIASES[name]) return { key: CHORD_ALIASES[name], data: CHORD_DB[CHORD_ALIASES[name]] };
  const u = name.charAt(0).toUpperCase() + name.slice(1);
  if (CHORD_DB[u]) return { key: u, data: CHORD_DB[u] };
  return null;
}

function ChordDiagram({ chordData, animate }) {
  const FRETS=5,SS=36,FS=38;
  const PAD={top:50,left:44,right:20,bottom:20};
  const W=PAD.left+5*SS+PAD.right,H=PAD.top+FRETS*FS+PAD.bottom;
  const active=chordData.frets.filter(f=>f>0);
  const minF=active.length>0?Math.min(...active):0;
  const startFret=minF>1?minF:1;
  const colors=["#f0c040","#e07060","#70b8e0","#80d8a0","#c080e0"];
  return (
    <svg width={W} height={H} style={{filter:"drop-shadow(0 4px 24px rgba(240,192,64,0.15))"}}>
      {startFret===1
        ?<rect x={PAD.left-4} y={PAD.top-6} width={5*SS+8} height={7} rx={3} fill="#f0c040"/>
        :<text x={PAD.left-14} y={PAD.top+FS*0.5+5} textAnchor="end" fill="#aaa" fontSize={12} fontFamily="monospace">{startFret}fr</text>
      }
      {Array.from({length:FRETS+1}).map((_,i)=>(
        <line key={i} x1={PAD.left} y1={PAD.top+i*FS} x2={PAD.left+5*SS} y2={PAD.top+i*FS}
          stroke={i===0?"#555":"#333"} strokeWidth={i===0?1.5:1}/>
      ))}
      {STRINGS.map((s,i)=>(
        <g key={i}>
          <line x1={PAD.left+i*SS} y1={PAD.top} x2={PAD.left+i*SS} y2={PAD.top+FRETS*FS} stroke="#444" strokeWidth={i===0||i===5?2:1.2}/>
          <text x={PAD.left+i*SS} y={PAD.top-14} textAnchor="middle" fill="#666" fontSize={10} fontFamily="monospace">{s}</text>
        </g>
      ))}
      {chordData.barre&&(
        <rect x={PAD.left-10} y={PAD.top+(chordData.barre-startFret)*FS+FS*0.3}
          width={5*SS+20} height={FS*0.42} rx={FS*0.2} fill="#f0c040" opacity={0.8}/>
      )}
      {STRINGS.map((_,i)=>{
        const fret=chordData.frets[i];
        if(fret<=0)return null;
        const rel=fret-startFret+1;
        if(rel<1||rel>FRETS)return null;
        const cx=PAD.left+i*SS,cy=PAD.top+(rel-0.5)*FS;
        const finger=chordData.fingers[i];
        return(
          <g key={i}>
            <circle cx={cx} cy={cy} r={13} fill={finger>0?colors[finger-1]:"#f0c040"}
              opacity={animate?0.95:0.75}
              style={animate?{animation:`pulse 1.5s ease-in-out ${i*0.1}s infinite`}:{}}/>
            <text x={cx} y={cy+5} textAnchor="middle" fill="#1a1208" fontSize={11} fontWeight="bold" fontFamily="monospace">
              {finger>0?finger:""}
            </text>
          </g>
        );
      })}
      {STRINGS.map((_,i)=>{
        const fret=chordData.frets[i];
        const cx=PAD.left+i*SS,cy=PAD.top-30;
        if(fret===0)return<text key={i} x={cx} y={cy+4} textAnchor="middle" fill="#80d8a0" fontSize={15} fontWeight="bold">○</text>;
        if(fret===-1)return<text key={i} x={cx} y={cy+4} textAnchor="middle" fill="#e07060" fontSize={13} fontWeight="bold">✕</text>;
        return null;
      })}
    </svg>
  );
}

function RecordButton({ tutorialData, setCurrentStep, stepDuration }) {
  const [recording,setRecording]=useState(false);
  const [countdown,setCountdown]=useState(null);
  const [status,setStatus]=useState("");
  const mrRef=useRef(null),chunksRef=useRef([]),streamRef=useRef(null);

  const startRecording=useCallback(async()=>{
    try{
      setStatus("Meminta akses layar...");
      const stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:false});
      streamRef.current=stream;
      const mr=new MediaRecorder(stream,{
        mimeType:MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm"
      });
      mrRef.current=mr;chunksRef.current=[];
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=()=>{
        const blob=new Blob(chunksRef.current,{type:"video/webm"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;a.download=`guitar-tutorial-${Date.now()}.webm`;a.click();
        URL.revokeObjectURL(url);
        setStatus("✅ Video tersimpan di Downloads!");
        setRecording(false);
        setTimeout(()=>setStatus(""),5000);
      };
      stream.getVideoTracks()[0].onended=()=>{mr.stop();setRecording(false);setStatus("Rekaman selesai.");};
      setStatus("Bersiap...");
      for(let i=3;i>=1;i--){setCountdown(i);await new Promise(r=>setTimeout(r,1000));}
      setCountdown(null);
      mr.start();setRecording(true);setStatus("🔴 Sedang merekam...");
      setCurrentStep(0);
      const steps=tutorialData?.steps||[];
      for(let i=0;i<steps.length;i++){
        setCurrentStep(i);
        await new Promise(r=>setTimeout(r,stepDuration));
      }
      mr.stop();stream.getTracks().forEach(t=>t.stop());
    }catch(err){
      if(err.name==="NotAllowedError")setStatus("❌ Akses layar ditolak.");
      else setStatus("❌ Error: "+err.message);
      setRecording(false);setCountdown(null);
    }
  },[tutorialData,setCurrentStep,stepDuration]);

  const stopRecording=()=>{
    mrRef.current?.stop();
    streamRef.current?.getTracks().forEach(t=>t.stop());
    setRecording(false);setCountdown(null);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <button onClick={recording?stopRecording:startRecording} disabled={!!countdown} style={{
        background:recording?"linear-gradient(135deg,#e04020,#c02010)":countdown?"#1a1208":"linear-gradient(135deg,#c080e0,#8040c0)",
        border:"none",borderRadius:10,padding:"14px",
        color:countdown?"#c080e0":"#fff",fontWeight:700,fontSize:13,
        cursor:countdown?"not-allowed":"pointer",fontFamily:"monospace",
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
        animation:recording?"recordPulse 1.5s ease-in-out infinite":"none",transition:"all 0.3s",
      }}>
        {countdown?`⏳ Mulai dalam ${countdown}...`:recording?"⏹ Stop & Simpan Video":"🎬 Rekam & Export Video (.webm)"}
      </button>
      {status&&(
        <div style={{
          background:"rgba(192,128,224,0.06)",border:"1px solid rgba(192,128,224,0.2)",
          borderRadius:8,padding:"8px 14px",
          color:status.startsWith("✅")?"#80d8a0":status.startsWith("❌")?"#e07060":"#c080e0",
          fontSize:12,fontFamily:"monospace",textAlign:"center",
        }}>{status}</div>
      )}
    </div>
  );
}

function ChordBrowser({ onSelect }) {
  const [search,setSearch]=useState("");
  const [open,setOpen]=useState(false);
  const cats=[
    {label:"Mayor",keys:["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]},
    {label:"Minor",keys:["Am","A#m","Bm","Cm","C#m","Dm","D#m","Em","Fm","F#m","Gm","G#m"]},
    {label:"Dom 7th",keys:["C7","D7","E7","F7","G7","A7","B7"]},
    {label:"Minor 7th",keys:["Am7","Bm7","Cm7","Dm7","Em7","F#m7","Gm7"]},
    {label:"Major 7th",keys:["Cmaj7","Dmaj7","Emaj7","Fmaj7","Gmaj7","Amaj7"]},
    {label:"Suspended",keys:["Csus2","Csus4","Dsus2","Dsus4","Esus4","Asus2","Asus4"]},
    {label:"Power",keys:["E5","A5","D5","G5","B5","C5"]},
    {label:"Add/Aug/Dim",keys:["Cadd9","Dadd9","Gadd9","Caug","Eaug","Adim","Edim"]},
  ];
  const filtered=search?Object.keys(CHORD_DB).filter(k=>k.toLowerCase().includes(search.toLowerCase())):null;
  if(!open)return(
    <button onClick={()=>setOpen(true)} style={{
      background:"transparent",border:"1px solid #2a2010",borderRadius:8,
      padding:"7px 13px",color:"#888",fontSize:11,cursor:"pointer",fontFamily:"monospace",
    }}>🎵 Browse {Object.keys(CHORD_DB).length} Chord Tersedia</button>
  );
  return(
    <div style={{background:"#0f0f0f",border:"1px solid #2a2010",borderRadius:12,padding:14,marginTop:6}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <span style={{color:"#f0c040",fontSize:11,fontFamily:"monospace"}}>📚 {Object.keys(CHORD_DB).length} Chord</span>
        <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:14}}>✕</button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari chord..."
        style={{width:"100%",background:"#0a0a0a",border:"1px solid #2a2010",borderRadius:6,
          padding:"7px 11px",color:"#fff",fontSize:12,fontFamily:"monospace",outline:"none",
          boxSizing:"border-box",marginBottom:10}}/>
      {filtered?(
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {filtered.map(k=>(
            <button key={k} onClick={()=>{onSelect(k);setOpen(false);setSearch("");}} style={{
              background:"#1a1208",border:"1px solid #3a2010",borderRadius:6,
              padding:"3px 9px",color:"#f0c040",fontSize:11,cursor:"pointer",fontFamily:"monospace",
            }}>{k}</button>
          ))}
        </div>
      ):cats.map(cat=>(
        <div key={cat.label} style={{marginBottom:9}}>
          <div style={{color:"#444",fontSize:9,letterSpacing:2,fontFamily:"monospace",marginBottom:4}}>{cat.label.toUpperCase()}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {cat.keys.map(k=>(
              <button key={k} onClick={()=>{onSelect(k);setOpen(false);}} style={{
                background:"#1a1208",border:"1px solid #222",borderRadius:5,
                padding:"2px 8px",color:"#bbb",fontSize:10,cursor:"pointer",fontFamily:"monospace",
              }}
              onMouseEnter={e=>{e.target.style.borderColor="#f0c040";e.target.style.color="#f0c040";}}
              onMouseLeave={e=>{e.target.style.borderColor="#222";e.target.style.color="#bbb";}}
              >{k}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TutorialDisplay({ data, isPlaying, currentStep }) {
  const steps=data?.steps||[];
  const current=steps[currentStep]||{};
  const resolved=resolveChord(current.chord);
  return(
    <div style={{
      background:"linear-gradient(135deg,#0f0f0f 0%,#1a1208 50%,#0f0f0f 100%)",
      border:"1px solid #2a2010",borderRadius:16,padding:"26px 22px",minHeight:440,
      display:"flex",flexDirection:"column",gap:18,position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,
        background:"radial-gradient(circle,rgba(240,192,64,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <div style={{color:"#f0c040",fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:4,fontFamily:"monospace"}}>🎸 Guitar Tutorial</div>
          <h2 style={{color:"#fff",fontSize:19,fontWeight:700,margin:0,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.3}}>
            {data?.title||"—"}
          </h2>
          <div style={{color:"#444",fontSize:10,marginTop:4,fontFamily:"monospace"}}>{data?.level} • {data?.duration}</div>
        </div>
        <div style={{background:"#1a1208",border:"1px solid #3a2a10",borderRadius:7,padding:"4px 11px",color:"#f0c040",fontSize:11,fontFamily:"monospace"}}>
          {currentStep+1} / {steps.length}
        </div>
      </div>
      {current&&(
        <div style={{display:"flex",gap:18,alignItems:"flex-start",flex:1}}>
          {resolved&&(
            <div style={{background:"#111",border:"1px solid #2a2010",borderRadius:12,
              padding:"12px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,minWidth:172,
              animation:isPlaying?"fadeIn 0.5s ease":"none"}}>
              <ChordDiagram chordData={resolved.data} animate={isPlaying}/>
              <div style={{color:"#f0c040",fontSize:16,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif"}}>{resolved.key}</div>
            </div>
          )}
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{color:"#f0c040",fontSize:10,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",opacity:0.6}}>Langkah {currentStep+1}</div>
            <h3 style={{color:"#fff",fontSize:16,margin:0,fontFamily:"'Playfair Display',Georgia,serif"}}>{current.title}</h3>
            <p style={{color:"#ccc",fontSize:13,lineHeight:1.8,margin:0,fontFamily:"Georgia,serif",animation:isPlaying?"fadeIn 0.6s ease":"none"}}>
              {current.description}
            </p>
            {current.tips&&(
              <div style={{background:"rgba(240,192,64,0.05)",border:"1px solid rgba(240,192,64,0.18)",
                borderLeft:"3px solid #f0c040",borderRadius:"0 8px 8px 0",padding:"8px 12px"}}>
                <div style={{color:"#f0c040",fontSize:9,letterSpacing:2,marginBottom:3,fontFamily:"monospace"}}>💡 TIPS</div>
                <div style={{color:"#bbb",fontSize:12,fontFamily:"Georgia,serif",lineHeight:1.6}}>{current.tips}</div>
              </div>
            )}
            {current.fingers&&Array.isArray(current.fingers)&&(
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {current.fingers.map((f,i)=>(
                  <div key={i} style={{background:"#1a1208",border:"1px solid #3a2010",borderRadius:5,
                    padding:"2px 8px",color:"#f0c040",fontSize:10,fontFamily:"monospace"}}>{f}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{background:"#1a1208",borderRadius:4,height:4,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(90deg,#f0c040,#e07020)",height:"100%",
          width:`${((currentStep+1)/steps.length)*100}%`,borderRadius:4,transition:"width 0.5s ease"}}/>
      </div>
    </div>
  );
}

export default function App() {
  const [topic,setTopic]=useState("");
  const [loading,setLoading]=useState(false);
  const [tutorialData,setTutorialData]=useState(null);
  const [error,setError]=useState("");
  const [isPlaying,setIsPlaying]=useState(false);
  const [currentStep,setCurrentStep]=useState(0);
  const [stepDuration,setStepDuration]=useState(5000);
  const intervalRef=useRef(null);

  const generateTutorial=async()=>{
    if(!topic.trim())return;
    setLoading(true);setError("");setTutorialData(null);
    setCurrentStep(0);setIsPlaying(false);
    clearInterval(intervalRef.current);
    try{
      // Panggil internal API route — API key aman di server
      const res=await fetch("/api/generate",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          topic,
          availableChords:Object.keys(CHORD_DB).join(", "),
        }),
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"API error");
      setTutorialData(data);
    }catch(err){
      setError("Gagal generate tutorial: "+err.message);
    }finally{
      setLoading(false);
    }
  };

  const startSlides=()=>{
    setIsPlaying(true);setCurrentStep(0);
    intervalRef.current=setInterval(()=>{
      setCurrentStep(prev=>{
        if(prev>=(tutorialData?.steps?.length||1)-1){clearInterval(intervalRef.current);setIsPlaying(false);return prev;}
        return prev+1;
      });
    },stepDuration);
  };
  const stopSlides=()=>{clearInterval(intervalRef.current);setIsPlaying(false);};
  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  const examples=["Chord C Mayor pemula","Progression Am F C G","Barre chord F Mayor","Fingerpicking dasar","Chord 7th jazz","Power chord rock"];

  return(
    <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"Georgia,serif",paddingBottom:48}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes pulse{0%,100%{opacity:0.9;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes recordPulse{0%,100%{box-shadow:0 0 0 0 rgba(192,64,32,0.5)}50%{box-shadow:0 0 0 10px rgba(192,64,32,0)}}
        ::placeholder{color:#444}
      `}</style>

      <div style={{background:"linear-gradient(180deg,#111 0%,#0a0a0a 100%)",borderBottom:"1px solid #1a1208",padding:"20px 24px 16px",marginBottom:22}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:3}}>
            <span style={{fontSize:24}}>🎸</span>
            <div>
              <h1 style={{margin:0,fontSize:19,fontFamily:"'Playfair Display',Georgia,serif",
                background:"linear-gradient(90deg,#f0c040,#e07020)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                Guitar Tutorial Generator
              </h1>
              <div style={{color:"#444",fontSize:9,fontFamily:"monospace",letterSpacing:2,marginTop:2}}>
                BRAND CREATORS ID • AI POWERED • {Object.keys(CHORD_DB).length} CHORDS
              </div>
            </div>
          </div>
          <p style={{color:"#444",fontSize:11,margin:0,fontFamily:"monospace"}}>Input topik → Generate → Rekam video → Upload 🚀</p>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"0 16px"}}>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:14,padding:16,marginBottom:14}}>
          <label style={{color:"#555",fontSize:9,letterSpacing:2,fontFamily:"monospace",display:"block",marginBottom:7}}>TOPIK TUTORIAL</label>
          <div style={{display:"flex",gap:8}}>
            <input value={topic} onChange={e=>setTopic(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&generateTutorial()}
              placeholder="contoh: Chord Am untuk pemula..."
              style={{flex:1,background:"#0a0a0a",border:"1px solid #2a2010",borderRadius:8,
                padding:"10px 13px",color:"#fff",fontSize:14,fontFamily:"Georgia,serif",outline:"none"}}/>
            <button onClick={generateTutorial} disabled={loading||!topic.trim()} style={{
              background:loading?"#1a1208":"linear-gradient(135deg,#f0c040,#e07020)",
              border:"none",borderRadius:8,padding:"10px 16px",
              color:loading?"#555":"#1a1208",fontWeight:700,fontSize:12,
              cursor:loading?"not-allowed":"pointer",fontFamily:"monospace",whiteSpace:"nowrap",
            }}>
              {loading
                ?<span style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{display:"inline-block",width:10,height:10,border:"2px solid #333",borderTopColor:"#f0c040",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                  Proses...
                </span>:"✦ Generate"}
            </button>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:9}}>
            {examples.map((ex,i)=>(
              <button key={i} onClick={()=>setTopic(ex)} style={{
                background:"transparent",border:"1px solid #1e1e1e",borderRadius:20,
                padding:"2px 8px",color:"#444",fontSize:9,cursor:"pointer",fontFamily:"monospace",
              }}
              onMouseEnter={e=>{e.target.style.borderColor="#f0c040";e.target.style.color="#f0c040";}}
              onMouseLeave={e=>{e.target.style.borderColor="#1e1e1e";e.target.style.color="#444";}}
              >{ex}</button>
            ))}
          </div>
          <div style={{marginTop:10}}>
            <ChordBrowser onSelect={chord=>setTopic(`Tutorial chord ${chord}`)}/>
          </div>
        </div>

        {error&&<div style={{background:"#1a0808",border:"1px solid #3a1010",borderRadius:8,padding:"9px 13px",color:"#e07060",fontSize:12,marginBottom:10,fontFamily:"monospace"}}>⚠ {error}</div>}

        {loading&&(
          <div style={{background:"#111",border:"1px solid #1a1208",borderRadius:14,padding:26,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
            <div style={{fontSize:28,animation:"pulse 1s ease-in-out infinite"}}>🎸</div>
            <div style={{color:"#555",fontSize:11,fontFamily:"monospace"}}>AI sedang menyusun tutorial...</div>
            {[70,50,80,40].map((w,i)=>(
              <div key={i} style={{height:9,width:`${w}%`,borderRadius:5,
                background:"linear-gradient(90deg,#1a1208 25%,#2a2010 50%,#1a1208 75%)",
                backgroundSize:"200% 100%",animation:`shimmer 1.5s ease-in-out ${i*0.15}s infinite`}}/>
            ))}
          </div>
        )}

        {tutorialData&&!loading&&(
          <>
            <TutorialDisplay data={tutorialData} isPlaying={isPlaying} currentStep={currentStep}/>
            <div style={{background:"#111",border:"1px solid #1a1208",borderRadius:9,padding:"10px 14px",marginTop:10,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{color:"#444",fontSize:10,fontFamily:"monospace",whiteSpace:"nowrap"}}>⏱ Durasi per slide:</span>
              {[3000,5000,7000,10000].map(d=>(
                <button key={d} onClick={()=>setStepDuration(d)} style={{
                  background:stepDuration===d?"#2a2010":"transparent",
                  border:`1px solid ${stepDuration===d?"#f0c040":"#222"}`,
                  borderRadius:5,padding:"3px 9px",
                  color:stepDuration===d?"#f0c040":"#444",
                  fontSize:10,cursor:"pointer",fontFamily:"monospace",
                }}>{d/1000}s</button>
              ))}
            </div>
            <div style={{display:"flex",gap:7,marginTop:8}}>
              {!isPlaying
                ?<button onClick={startSlides} style={{flex:1,background:"linear-gradient(135deg,#f0c040,#e07020)",border:"none",borderRadius:9,padding:"12px",color:"#1a1208",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>▶ Auto Slide Preview</button>
                :<button onClick={stopSlides} style={{flex:1,background:"#1a1208",border:"1px solid #3a2010",borderRadius:9,padding:"12px",color:"#f0c040",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>⏹ Stop</button>
              }
              <button onClick={()=>setCurrentStep(s=>Math.max(0,s-1))} disabled={currentStep===0} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:9,padding:"12px 15px",color:currentStep===0?"#222":"#999",cursor:currentStep===0?"not-allowed":"pointer",fontFamily:"monospace",fontSize:14}}>◀</button>
              <button onClick={()=>setCurrentStep(s=>Math.min((tutorialData?.steps?.length||1)-1,s+1))} disabled={currentStep>=(tutorialData?.steps?.length||1)-1} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:9,padding:"12px 15px",color:currentStep>=(tutorialData?.steps?.length||1)-1?"#222":"#999",cursor:currentStep>=(tutorialData?.steps?.length||1)-1?"not-allowed":"pointer",fontFamily:"monospace",fontSize:14}}>▶</button>
            </div>
            <div style={{marginTop:7}}>
              <RecordButton tutorialData={tutorialData} setCurrentStep={setCurrentStep} stepDuration={stepDuration}/>
            </div>
            <div style={{background:"rgba(192,128,224,0.04)",border:"1px solid rgba(192,128,224,0.12)",borderRadius:9,padding:"10px 13px",marginTop:7,display:"flex",alignItems:"flex-start",gap:9}}>
              <span style={{fontSize:14,marginTop:1}}>📋</span>
              <div style={{color:"#555",fontSize:10,fontFamily:"monospace",lineHeight:1.7}}>
                <span style={{color:"#c080e0",fontWeight:"bold"}}>Cara export video:</span><br/>
                1. Generate tutorial → atur durasi slide<br/>
                2. Klik <span style={{color:"#c080e0"}}>🎬 Rekam & Export Video</span><br/>
                3. Pilih <span style={{color:"#f0c040"}}>"Tab ini"</span> saat dialog muncul<br/>
                4. Tunggu semua slide selesai otomatis<br/>
                5. File .webm tersimpan → upload ke Facebook/TikTok
              </div>
            </div>
          </>
        )}

        {!tutorialData&&!loading&&(
          <div style={{textAlign:"center",padding:"40px 24px",color:"#222",fontFamily:"monospace",fontSize:11}}>
            <div style={{fontSize:40,marginBottom:12,opacity:0.15}}>🎸</div>
            <div>Input topik di atas dan tekan Generate</div>
          </div>
        )}
      </div>
    </div>
  );
}
