import { Example } from "./Example";

import styles from "./Example.module.css";

const DEFAULT_EXAMPLES: string[] = [
    "What are your strengths and weaknesses?",
    "Tell me about yourself",
    "Write a cover letter"
];

const GPT4V_EXAMPLES: string[] = [
    "What are your strengths and weaknesses?",
    "Tell me about yourself",
    "What are some of your proudest accomplishments?"
];

interface Props {
    onExampleClicked: (value: string) => void;
    useGPT4V?: boolean;
}

export const ExampleList = ({ onExampleClicked, useGPT4V }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {(useGPT4V ? GPT4V_EXAMPLES : DEFAULT_EXAMPLES).map((question, i) => (
                <li key={i}>
                    <Example text={question} value={question} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
