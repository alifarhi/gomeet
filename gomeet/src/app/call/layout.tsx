interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="h-screen bg-green-950">{children}</div>;
};

export default Layout;
