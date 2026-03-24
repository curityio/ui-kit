import { FC, ReactNode, useState } from 'react';
import { JsonValue } from './types';

interface JsonPrettifyProps {
  data: JsonValue;
  indentSize?: number;
}

const COLLAPSE_BUTTON_CLASS = 'button button-tiny button-primary-outline w-1 h-1';
const COLLAPSE_BUTTON_STYLE = { borderRadius: '50%', fontSize: '1rem' };

const ObjectProperty = ({
  propKey,
  value,
  level,
  isLast,
  indentSize,
  escape,
  render,
}: {
  propKey: string;
  value: JsonValue;
  level: number;
  isLast: boolean;
  indentSize: number;
  escape: (str: string) => string;
  render: (value: JsonValue, level: number) => ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const nextIndent = ' '.repeat((level + 1) * indentSize);
  const isNested =
    typeof value === 'object' &&
    value !== null &&
    (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);

  if (!isNested) {
    return (
      <>
        {nextIndent}
        <span className="json-pretty-print-key">"{escape(propKey)}"</span>
        <span className="json-pretty-print-colon">: </span>
        {render(value, level + 1)}
        {!isLast && <span className="json-pretty-print-comma">,</span>}
        {'\n'}
      </>
    );
  }

  const preview = Array.isArray(value)
    ? `[... ${String(value.length)} items]`
    : `{... ${String(Object.keys(value).length)} keys}`;

  return (
    <>
      {nextIndent}
      <button
        className={COLLAPSE_BUTTON_CLASS}
        style={COLLAPSE_BUTTON_STYLE}
        onClick={() => setIsCollapsed(!isCollapsed)}
        type="button"
      >
        {isCollapsed ? '+' : '-'}
      </button>{' '}
      <span className="json-pretty-print-key">"{escape(propKey)}"</span>
      <span className="json-pretty-print-colon">: </span>
      {isCollapsed ? (
        <>
          <span style={{ opacity: 0.6 }}>{preview}</span>
          {!isLast && <span className="json-pretty-print-comma">,</span>}
          {'\n'}
        </>
      ) : (
        <>
          {render(value, level + 1)}
          {!isLast && <span className="json-pretty-print-comma">,</span>}
          {'\n'}
        </>
      )}
    </>
  );
};

const ArrayRenderer = ({
  array,
  level,
  indentSize,
  render,
}: {
  array: JsonValue[];
  level: number;
  indentSize: number;
  render: (value: JsonValue, level: number) => ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const indent = ' '.repeat(level * indentSize);
  const nextIndent = ' '.repeat((level + 1) * indentSize);

  return (
    <>
      <button
        className={COLLAPSE_BUTTON_CLASS}
        style={COLLAPSE_BUTTON_STYLE}
        onClick={() => setIsCollapsed(!isCollapsed)}
        type="button"
      >
        {isCollapsed ? '+' : '-'}
      </button>{' '}
      <span className="json-pretty-print-bracket">[</span>
      {isCollapsed ? (
        <span style={{ opacity: 0.6 }}>... {String(array.length)} items</span>
      ) : (
        <>
          {'\n'}
          {array.map((item, i) => (
            <span key={`item-${String(i)}`}>
              {nextIndent}
              {render(item, level + 1)}
              {i < array.length - 1 && <span className="json-pretty-print-comma">,</span>}
              {'\n'}
            </span>
          ))}
          {indent}
        </>
      )}
      <span className="json-pretty-print-bracket">]</span>
    </>
  );
};

const JsonPrettify: FC<JsonPrettifyProps> = ({ data, indentSize = 2 }) => {
  const escape = (str: string) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const renderPrimitive = (value: JsonValue) => {
    if (value === null) return <span className="json-pretty-print-null">null</span>;
    if (typeof value === 'string') return <span className="json-pretty-print-string">"{escape(value)}"</span>;
    if (typeof value === 'number') return <span className="json-pretty-print-number">{value}</span>;
    if (typeof value === 'boolean') return <span className="json-pretty-print-boolean">{String(value)}</span>;
    return null;
  };

  const renderArray = (array: JsonValue[], level: number) => {
    if (array.length === 0) return <span className="json-pretty-print-bracket">[]</span>;
    return <ArrayRenderer array={array} level={level} indentSize={indentSize} render={render} />;
  };

  const renderObject = (obj: Record<string, JsonValue>, level: number) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return <span className="json-pretty-print-brace">{'{}'}</span>;

    const indent = ' '.repeat(level * indentSize);

    return (
      <>
        <span className="json-pretty-print-brace">{'{'}</span>
        {'\n'}
        {entries.map(([key, value], i) => (
          <ObjectProperty
            key={key}
            propKey={key}
            value={value}
            level={level}
            isLast={i === entries.length - 1}
            indentSize={indentSize}
            escape={escape}
            render={render}
          />
        ))}
        {indent}
        <span className="json-pretty-print-brace">{'}'}</span>
      </>
    );
  };

  const render = (value: JsonValue, level = 0): ReactNode => {
    if (value === null || typeof value !== 'object') return renderPrimitive(value);
    if (Array.isArray(value)) return renderArray(value, level);
    return renderObject(value, level);
  };

  return <pre className="json-pretty-print-root">{render(data, 0)}</pre>;
};

export default JsonPrettify;
