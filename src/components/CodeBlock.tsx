import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import * as stylex from '@stylexjs/stylex';

type Props = {
  code: string;
  language?: string;
};

const styles = stylex.create({
  pre: {
    backgroundColor: '#0b1224',
    borderRadius: 16,
    padding: 16,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'auto',
  },
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 13,
    lineHeight: 1.6,
  },
});

export default function CodeBlock({ code, language = 'typescript' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = code;
    hljs.highlightElement(ref.current);
  }, [code, language]);

  return (
    <pre {...stylex.props(styles.pre)}>
      <code ref={ref} className={`language-${language}`} {...stylex.props(styles.code)} />
    </pre>
  );
}
