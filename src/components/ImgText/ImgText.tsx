



export default function ImgText(prop: {src:string,text:string,width:number,right?:boolean,cotents?:[string]}) {

    return (
        <div style={{display:'flex',flexDirection:'row',alignItems:'top',justifyContent:'center',flexWrap:"nowrap"}}>
            {!(prop.right ?? false) &&
                <img src={prop.src} style={{flexGrow:1,width:prop.width}} />
            }

            <div style={{flexGrow:1,display:'flex',flexDirection:'column',alignItems:'left'}}>
                <div style={{marginLeft:"20px"}} dangerouslySetInnerHTML={{__html: prop.text}} />
                {prop.cotents &&
                    prop.cotents.map((content) => {
                        return <div style={{margin:"8px 10px"}} dangerouslySetInnerHTML={{__html: content}} />
                    })
                }
            </div>
            
            {(prop.right ?? false) &&
                <img src={prop.src} style={{flexGrow:1,width:prop.width}}/>
            }
        </div>
    );
}