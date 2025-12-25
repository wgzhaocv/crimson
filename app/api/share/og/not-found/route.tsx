import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const GET = async () => {
  // 从本地读取 Noto Sans JP 字体
  const fontPath = join(process.cwd(), "app/fonts/NotoSansJP-Bold.woff2");
  const fontData = await readFile(fontPath);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1A1A1A 0%, #2D1A1A 50%, #1A1A1A 100%)",
        fontFamily: "Noto Sans JP",
      }}
    >
      {/* 背景装饰圆 */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220, 20, 60, 0.15) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220, 20, 60, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Logo / 品牌名 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #DC143C 0%, #8B0000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "16px",
          }}
        >
          <span style={{ fontSize: "32px", color: "#fff" }}>C</span>
        </div>
        <span
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#DC143C",
            letterSpacing: "2px",
          }}
        >
          CRIMSON
        </span>
      </div>

      {/* 图标 */}
      <div
        style={{
          fontSize: "80px",
          marginBottom: "24px",
        }}
      >
        🔍
      </div>

      {/* 主标题 */}
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: "#FFFFFF",
          margin: "0 0 16px 0",
          textAlign: "center",
        }}
      >
        コンテンツが見つかりません
      </h1>

      {/* 副标题 */}
      <p
        style={{
          fontSize: "24px",
          color: "rgba(255, 255, 255, 0.7)",
          margin: 0,
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        この共有コンテンツは存在しないか、非公開に設定されています。
      </p>

      {/* 底部装饰线 */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          width: "200px",
          height: "4px",
          background:
            "linear-gradient(90deg, transparent 0%, #DC143C 50%, transparent 100%)",
          borderRadius: "2px",
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
};
