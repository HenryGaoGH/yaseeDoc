

export default function Block(props:{right:boolean,title:string,desc:string,color:string}) {
    return (
        <div style={{display:'flex',flexDirection:props.right ? "row-reverse" : 'row',alignItems:'center',backgroundColor:props.color,height:"320px",padding:'0px 20px'}}>
          <span>
            <p style={{color:'white',fontSize:40,textAlign:props.right ?'end' : "start"}}>{props.title}</p>
            <p style={{color:'white',fontSize:20,textAlign:props.right ?'end' : "start"}}>{props.desc}</p>
          </span>
        </div>
    );
};