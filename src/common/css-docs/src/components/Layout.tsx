import { Header } from '@components/Header';
import { Sidebar } from '@components/Sidebar';
import { CopyToClipboard } from '@components/CopyToClipboard';

export const Layout = ({ children }: { children?: any }) => (
  <>
    <Header title="CSS" />
    <div className="layout">
      <Sidebar />
      <main className="main">
        <div className="container">
          <header>
            <h1>Hey</h1>
          </header>
          <CopyToClipboard />
          {children}
        </div>
      </main>
    </div>
  </>
);
