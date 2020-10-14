import React, { useState } from 'react';

import { CodeBlock } from './CodeBlock';
import { useParams } from 'react-router-dom';
import styles from './SetupPage.module.css';
import useFetch from 'use-http';
import { Skeleton } from 'antd';

enum PlatformType {
    Html,
    React,
    Vue,
}

export const SetupPage = () => {
    const [platform, setPlatform] = useState(PlatformType.React);

    return (
        <div className={styles.setupWrapper}>
            <div className={styles.snippetCard}>
                <div className={styles.snippetHeading}>
                    Your Recording Snippet
                </div>
                <RadioGroup
                    platform={platform}
                    onSelect={(p: PlatformType) => setPlatform(p)}
                />
                {platform === PlatformType.Html ? (
                    <HtmlInstructions />
                ) : (
                    <JsAppInstructions platform={platform} />
                )}
                <div className={styles.snippetHeadingTwo}>
                    Identifying Users
                </div>
                <div className={styles.snippetSubHeading}>
                    To tag sessions with user specific identifiers (name, email,
                    etc.), you can call the
                    <span className={styles.codeBlockBasic}>
                        {'H.identify(id: string, object: Object)'}
                    </span>{' '}
                    method in your javascript app. Here's an example:
                </div>
                <CodeBlock
                    onCopy={() =>
                        window.analytics.track('Copied Code Snippet', {})
                    }
                    text={`H.identify(\n\t"jay@gmail.com", \n\t{id: "ajdf837dj", phone: "867-5309"}\n)`}
                />
            </div>
        </div>
    );
};

const HtmlInstructions = () => {
    const { loading, error, data = '' } = useFetch<string>(
        'https://unpkg.com/highlight.run@latest/dist/index.js',
        {},
        []
    );
    const codeStr = data.replace(/(\r\n|\n|\r)/gm, '');
    const { organization_id } = useParams();

    return (
        <>
            <div className={styles.snippetHeadingTwo}>
                Installing the Package
            </div>
            <div className={styles.snippetSubHeading}>
                Copy and paste the{' '}
                <span className={styles.codeBlockBasic}>{'<script/>'}</span>{' '}
                below into the
                <span className={styles.codeBlockBasic}>{'<head/>'}</span> of
                every page you wish to record.
            </div>
            <div>
                {loading || error ? (
                    <Skeleton active />
                ) : (
                    <CodeBlock
                        onCopy={() =>
                            window.analytics.track('Copied Script', {})
                        }
                        text={`<script>
${codeStr}
window.H.init(${organization_id})
</script>`}
                    />
                )}
            </div>
        </>
    );
};

const JsAppInstructions = ({ platform }: { platform: PlatformType }) => {
    const { organization_id } = useParams();
    const isReact = platform === PlatformType.React;
    return (
        <>
            <div className={styles.snippetHeadingTwo}>
                Installing the Package
            </div>
            <div className={styles.snippetSubHeading}>
                Install the{' '}
                <span className={styles.codeBlockBasic}>{'highlight.run'}</span>{' '}
                package via your javascript package manager.
                <br />
                <CodeBlock text={`npm install highlight.run`} />
                Or with yarn:
                <CodeBlock text={`yarn add highlight.run`} />
            </div>
            <div className={styles.snippetHeadingTwo}>
                Initializing Highlight
            </div>
            <div className={styles.snippetSubHeading}>
                Initialize the SDK by importing Highlight like so:{' '}
                <CodeBlock text={`import { H } from 'highlight.run'`} />
                and then calling{' '}
                <span
                    className={styles.codeBlockBasic}
                >{`H.init(${organization_id})`}</span>{' '}
                as soon as you can in your site's startup process.
                <CodeBlock
                    text={`H.init(${organization_id}) // ${organization_id} is your ORG_ID`}
                />
                In {isReact ? 'React' : 'Vue'}, it can be called at the top of
                your main component's file like this:
                <br />
                {isReact ? (
                    <CodeBlock
                        text={`import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { H } from 'highlight.run'
 
H.init(${organization_id}); // ${organization_id} is your ORG_ID
 
ReactDOM.render(<App />, document.getElementById('root'));`}
                    />
                ) : (
                    <CodeBlock
                        text={`import Vue from 'vue';
import App from './App.vue';
import { H } from 'highlight.run';
 
H.init(${organization_id}); // ${organization_id} is your ORG_ID
Vue.prototype.$H = H;
 
new Vue({
  render: h => h(App)
}).$mount('#app');`}
                    />
                )}
            </div>
        </>
    );
};

const RadioGroup = ({
    onSelect,
    platform,
}: {
    onSelect: (p: PlatformType) => void;
    platform: PlatformType;
}) => {
    return (
        <div className={styles.radioGroupWrapper}>
            <div
                style={{
                    borderRadius: '8px 0 0 8px',
                    borderRight: 'none',
                    borderColor:
                        platform === PlatformType.React ? '#5629c6' : '#eaeaea',
                    backgroundColor:
                        platform === PlatformType.React ? '#5629c6' : 'white',
                    color: platform === PlatformType.React ? 'white' : 'black',
                }}
                className={styles.platformOption}
                onClick={() => onSelect(PlatformType.React)}
            >
                React
            </div>
            <div
                style={{
                    borderColor:
                        platform === PlatformType.Vue ? '#5629c6' : '#eaeaea',
                    backgroundColor:
                        platform === PlatformType.Vue ? '#5629c6' : 'white',
                    color: platform === PlatformType.Vue ? 'white' : 'black',
                }}
                className={styles.platformOption}
                onClick={() => onSelect(PlatformType.Vue)}
            >
                Vue.js
            </div>
            <div
                style={{
                    borderRadius: '0 8px 8px 0',
                    borderLeft: 'none',
                    borderColor:
                        platform === PlatformType.Html ? '#5629c6' : '#eaeaea',
                    backgroundColor:
                        platform === PlatformType.Html ? '#5629c6' : 'white',
                    color: platform === PlatformType.Html ? 'white' : 'black',
                }}
                className={styles.platformOption}
                onClick={() => onSelect(PlatformType.Html)}
            >
                HTML
            </div>
        </div>
    );
};
