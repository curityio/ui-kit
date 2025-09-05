import "@curity-internal/css/dist/index.css";
import * as Icons from "@curity-internal/ui-icons-react";
import { version } from "../../package.json";

const IconItem = ({ name, Component, width, height, color }) => (
  <li>
    <Component aria-hidden="true" width={width} height={height} color={color} />
    <p>{name}</p>
  </li>
);

const App = () => {
  return (
    <div className="container p2">
      <h1>Curity UI Icons React</h1>
      <span className="pill pill-primary">{version}</span>

      <div className="py2 mt4">
        <h2>Install</h2>
        <pre>npm install @curity-internal/ui-icons-react</pre>
        <h2>Import</h2>
        <p>Import a singular icon</p>
        <pre>
          import &#123;IconTokenClaimsMappers &#125; from
          "@curity-internal/ui-icons-react"
        </pre>
        <p>Import multiple icons</p>
        <pre>
          import &#123;IconTokenClaimsMappers, IconGeneralPlus &#125; from
          "@curity-internal/ui-icons-react"
        </pre>
      </div>

      <div className="mt4">
        <h2>Examples</h2>
        <p>Regular icon usage</p>
        <Icons.IconTokenClaimsMappers width={48} height={48} />

        <pre>
          &lt;IconTokenClaimsMappers width={48} height={48} /&gt;
        </pre>

        <p>Icon with color and size</p>
        <Icons.IconTokenClaimsMappers width={96} height={96} color="#d859a1" />

        <pre>
          &lt;IconTokenClaimsMappers width={96} height={96} color="#d859a1"
          /&gt;
        </pre>

        <p>
          When placed inside a coloured background it utilizes{" "}
          <code>currentColor</code> to adapt color to the parent. In this case
          using the <code>white</code> class.
        </p>
        <div
          className="p2 bg-primary white br-8"
          style={{ width: "max-content" }}
        >
          <Icons.IconTokenClaimsMappers width={128} height={128} />
        </div>

        <pre>
          &lt;IconTokenClaimsMappers width={128} height={128} /&gt;
        </pre>
      </div>

      <h2 className="mt4">Icons available</h2>

      <main className="py2">
        <ul className="list-reset m0 grid-container" columns="2" md-columns="4">
          {Object.entries(Icons).map(([iconName, IconComponent]) => (
            <IconItem
              key={iconName}
              name={iconName}
              width={96}
              height={96}
              color={"black"}
              Component={IconComponent}
            />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
