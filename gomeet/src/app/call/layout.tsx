interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="h-screen bg-[oklch(0.2_0.0283_174.92]">{children}</div>;
};

export default Layout;
