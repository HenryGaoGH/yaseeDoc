



export default function ImgText(prop: {src:string,text:string,width:number,right?:boolean}) {

    return (
        <div style={{display:'flex',flexDirection:'row',alignItems:'top',justifyContent:'center',flexWrap:"nowrap"}}>
            {!(prop.right ?? false) &&
                <img src={prop.src} style={{flexGrow:1,width:prop.width}} />
            }
            <div style={{marginLeft:"20px",flexGrow:1}} dangerouslySetInnerHTML={{__html: prop.text}} />
            {(prop.right ?? false) &&
                <img src={prop.src} style={{flexGrow:1,width:prop.width}}/>
            }
        </div>
    );
}