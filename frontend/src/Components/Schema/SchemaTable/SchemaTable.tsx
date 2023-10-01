import React, { FC } from "react";
import styles from "./SchameTable.module.css";
import { TableProperties } from "../Schema";

interface SchemaTableProps {
  properties: TableProperties;
  tableName: string;
}

const SchemaTable: FC<SchemaTableProps> = (props) => {
  return (
    <div className={styles.SchemaTable}>
      <table>
        <tr>
          <td colSpan={2}>
            <strong>{props.tableName}</strong>
          </td>
        </tr>

        {Object.keys(props.properties).map((prop) => (
          <tr key={prop}>
            <td>{prop}</td>
            <td>{props.properties[prop]}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default SchemaTable;
