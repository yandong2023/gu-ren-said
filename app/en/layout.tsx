import "./language-switch.css";

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="en" dir="ltr">{children}</div>;
}
