export default function HighlightOrange({ text }: { text: string }) {
  return (
    <span style={{ color: "orange" }}>
      <b>{text}</b>
    </span>
  );
}
