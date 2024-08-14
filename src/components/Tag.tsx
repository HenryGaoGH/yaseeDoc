

interface TagProps {
    color:string
    text:string
}

export default function Tag(props:TagProps) {
    return (
        <span style={{backgroundColor:props.color ?? "orange",color:'white',textAlign:'center',verticalAlign:'middle',display:'inline-block',borderRadius:'5px',padding:'0px 6px'}}>
            { props.text ?? "暂未设置内容" }
        </span>
    );
}