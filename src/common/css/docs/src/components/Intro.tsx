export const Intro: React.FC = ({ children }) => (
  <div className="py2">
    <div className="py2 mw-40 mx-auto">
      <p>Curity CSS Toolkit</p>
      <h1 className="type-extra-bold">The baseline CSS toolkit for that Curity look and feel.</h1>
      <p>
        A minimalistic approach to styling Curity projects that live in a browser. Fast,
        easy-to-understand and without side effects.
      </p>
      {children}
    </div>
  </div>
);
