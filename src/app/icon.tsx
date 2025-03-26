import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 56,
  height: 56,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#191A23",
          color: "#B9FF66",
          borderRadius: "20%",
        }}
      >
        GB 
      </div>
    ),
    {
      ...size,
    },
  );
}