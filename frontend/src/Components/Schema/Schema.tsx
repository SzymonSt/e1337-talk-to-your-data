import { FC, useContext, useEffect, useState } from "react";
import styles from "./Schema.module.css";
import CodeMirror from "@uiw/react-codemirror";
import { ViewUpdate } from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Button } from "react-bootstrap";
import { languageContext } from "../../context/LanguageContext";
import AxiosClient from "../../services/AxiosClient";
import SchemaTable from "./SchemaTable/SchemaTable";

interface SchemaProps {}

export interface TableProperties {
  [key: string]: string | number | boolean;
}

interface TablesProperties {
  [tableName: string]: TableProperties;
}

const Schema: FC<SchemaProps> = (props) => {
  const [tablesProperties, setTablesProperties] = useState<TablesProperties>(
    {}
  );

  const langCtx = useContext(languageContext);

  const [sqlInput, setSqlInput] = useState("");
  const onChange = (val: string, viewUpdate: ViewUpdate) => {
    setSqlInput(val);
  };

  const onExecuteHandler = async () => {
    await AxiosClient.getInstance().post("/send_sql", {
      sql: sqlInput,
    });

    const response = await AxiosClient.getInstance().get("/get_schema");
    setTablesProperties(response.data.result);
    setSqlInput("");
  };

  useEffect(() => {
    const download = async () => {
      const response = await AxiosClient.getInstance().get("/get_schema");
      setTablesProperties(response.data.result);
    };
    download();
  }, []);

  return (
    <div className={styles.Schema}>
      <div className={styles.TablesView}>
        {Object.keys(tablesProperties).map((tableName) => (
          <SchemaTable
            key={tableName}
            tableName={tableName}
            properties={tablesProperties[tableName]}
          />
        ))}
      </div>
      <div className={styles.SQLInput}>
        <Button
          variant="primary"
          className={styles.SaveButton}
          onClick={onExecuteHandler}
        >
          {langCtx.language === "ENG" ? "Execute SQL" : "Wykonaj SQL"}
        </Button>
        <CodeMirror
          className={styles.CodeEditor}
          value={sqlInput}
          theme={"dark"}
          height="100%"
          extensions={[sql({})]}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Schema;
