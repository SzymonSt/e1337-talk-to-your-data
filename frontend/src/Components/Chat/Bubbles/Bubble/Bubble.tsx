import React, { FC } from "react";
import styles from "./Bubble.module.css";
import { MessageType, WHO } from "../../../../enums";
import AIIcon from "./Icon/AIIcon";
import HumanIcon from "./Icon/HumanIcon";
import SQLInputExtension from "./ContentExtensions/SQLInputExtension/SQLInputExtension";
import TableExtension from "./ContentExtensions/TableExtension/TableExtension";

interface BubbleProps {
  content?: any;
  who: WHO;
  isIconShown?: boolean;
  type: MessageType;
  onSQLModifyClick?: (content: string) => void;
  onSQLExecuteClick?: (contents: string) => void;
}

const Bubble: FC<BubbleProps> = ({
  isIconShown = true,
  type = MessageType.TEXT,
  ...props
}) => {

  return (
    <div
      className={`${styles.Bubble} ${props.who === WHO.AI && styles.BubbleAI}`}
    >
      {isIconShown && (props.who === WHO.AI ? <AIIcon /> : <HumanIcon />)}
      {type === MessageType.TEXT && <p>{props.content}</p>}
      {type === MessageType.SQL && (
        <SQLInputExtension
          content={props.content}
          onSQLModifyClick={props.onSQLModifyClick}
          onSQLExecuteClick={props.onSQLExecuteClick}
        />
      )}
      {type === MessageType.TABLE && <TableExtension content={props.content} />}
    </div>
  );
};

export default Bubble;
