import { useState } from "react";

export default function ImgText(prop: {
    src: string;
    text: string;
    width: number;
    right?: boolean;
    cotents?: [string];
}) {
    const [showPreview, setShowPreview] = useState(false);

    const renderImage = () => (
        <img
            src={prop.src}
            style={{
                flexGrow: 1,
                width: prop.width,
                cursor: "zoom-in",
            }}
            onClick={() => setShowPreview(true)}
        />
    );

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                flexWrap: "nowrap"
            }}>
                {!(prop.right ?? false) && renderImage()}

                <div style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start"
                }}>
                    <div
                        style={{ marginLeft: "20px" }}
                        dangerouslySetInnerHTML={{ __html: prop.text }}
                    />

                    {prop.cotents &&
                        prop.cotents.map((content, index) => (
                            <div
                                key={index}
                                style={{ margin: "8px 10px" }}
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ))
                    }
                </div>

                {(prop.right ?? false) && renderImage()}
            </div>

            {/* 图片预览 */}
            {showPreview && (
                <div
                    onClick={() => setShowPreview(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.85)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        cursor: "zoom-out",
                    }}
                >
                    <img
                        src={prop.src}
                        style={{
                            maxWidth: "95vw",
                            maxHeight: "95vh",
                            objectFit: "contain",
                        }}
                    />
                </div>
            )}
        </>
    );
}
