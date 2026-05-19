export interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: Module[];
  quiz: QuizQuestion[];
  tags: string[];
  instructor: string;
}

export const COURSES: Course[] = [
  {
    id: "dbt-101",
    title: "Intro to dbt for Analytics Engineers",
    description:
      "Learn how to transform raw data in your warehouse using dbt — the open-source SQL-first transformation tool trusted by thousands of data teams.",
    level: "Beginner",
    duration: "2 hours",
    instructor: "Linda R.",
    tags: ["dbt", "SQL", "Data Modeling", "Analytics Engineering"],
    modules: [
      {
        id: "m1",
        title: "What is dbt?",
        duration: "20 min",
        content: `## What is dbt?

dbt (data build tool) is an open-source command-line tool that enables analysts and engineers to transform data in their warehouse by writing simple SELECT statements.

### Why dbt?
- **Version control** your transformations alongside application code
- **Test** your data models automatically
- **Document** your data lineage visually
- **Collaborate** across your data team with modular SQL

### The dbt workflow
1. Write a \`.sql\` model file with a SELECT statement
2. Run \`dbt run\` to materialize it in the warehouse
3. Run \`dbt test\` to validate your data
4. Run \`dbt docs generate\` to publish your data catalog

dbt works on top of any modern data warehouse: Snowflake, BigQuery, Redshift, DuckDB, and more.`,
      },
      {
        id: "m2",
        title: "Models, Sources & Refs",
        duration: "25 min",
        content: `## Models, Sources & Refs

### Models
A dbt model is just a \`.sql\` file containing a SELECT statement. dbt turns it into a table or view in your warehouse.

\`\`\`sql
-- models/staging/stg_orders.sql
select
    order_id,
    customer_id,
    order_date,
    status
from {{ source('ecommerce', 'orders') }}
\`\`\`

### Sources
Sources define your raw data tables. Declare them in a \`schema.yml\` file:

\`\`\`yaml
sources:
  - name: ecommerce
    tables:
      - name: orders
      - name: customers
\`\`\`

### Refs
Use \`{{ ref('model_name') }}\` to reference another dbt model. This builds the DAG automatically:

\`\`\`sql
-- models/marts/fct_orders.sql
select
    o.order_id,
    c.full_name,
    o.order_date
from {{ ref('stg_orders') }} o
join {{ ref('stg_customers') }} c on o.customer_id = c.customer_id
\`\`\``,
      },
      {
        id: "m3",
        title: "Testing & Documentation",
        duration: "25 min",
        content: `## Testing & Documentation

### Built-in tests
dbt ships with four generic tests you add in YAML:

\`\`\`yaml
models:
  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
\`\`\`

Run them with:
\`\`\`bash
dbt test
\`\`\`

### Documentation
Add descriptions directly in your YAML:

\`\`\`yaml
models:
  - name: fct_orders
    description: "One row per order, joined with customer info."
    columns:
      - name: order_id
        description: "Primary key. Unique identifier for each order."
\`\`\`

Generate and serve docs:
\`\`\`bash
dbt docs generate
dbt docs serve
\`\`\``,
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What file type does dbt use to define transformation models?",
        options: [".py files", ".sql files", ".json files", ".yml files"],
        correctIndex: 1,
      },
      {
        id: "q2",
        question: "Which dbt function should you use to reference another dbt model?",
        options: ["{{ source() }}", "{{ model() }}", "{{ ref() }}", "{{ table() }}"],
        correctIndex: 2,
      },
      {
        id: "q3",
        question: "Which built-in dbt test checks that a column has no NULL values?",
        options: ["unique", "not_null", "accepted_values", "relationships"],
        correctIndex: 1,
      },
      {
        id: "q4",
        question: "What command runs all dbt models and materializes them in the warehouse?",
        options: ["dbt compile", "dbt test", "dbt run", "dbt deploy"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "spark-basics",
    title: "Apache Spark for Data Analysts",
    description:
      "Understand distributed data processing with Apache Spark. Learn DataFrames, transformations, and how to run analytics at scale.",
    level: "Intermediate",
    duration: "3 hours",
    instructor: "Rehma A.",
    tags: ["Spark", "PySpark", "Big Data", "Distributed Computing"],
    modules: [
      {
        id: "m1",
        title: "Spark Architecture",
        duration: "30 min",
        content: `## Spark Architecture

Apache Spark is a unified analytics engine for large-scale data processing.

### Core components
- **Driver**: The main process that orchestrates execution
- **Executors**: Worker processes on cluster nodes that do the actual computation
- **SparkContext / SparkSession**: Entry point to the Spark cluster

### RDDs vs DataFrames
- **RDD** (Resilient Distributed Dataset): Low-level, untyped distributed collection
- **DataFrame**: High-level, schema-aware table abstraction — use this for analytics
- **Dataset**: Typed DataFrame (Scala/Java only)

For analytics work, always prefer the **DataFrame API** — it benefits from Spark's Catalyst optimizer.

### Lazy evaluation
Spark operations are lazy. Transformations like \`filter()\` and \`select()\` build a logical plan but don't execute until you call an **action** like \`show()\`, \`collect()\`, or \`write()\`.`,
      },
      {
        id: "m2",
        title: "DataFrames & Transformations",
        duration: "35 min",
        content: `## DataFrames & Transformations

### Creating a DataFrame
\`\`\`python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("Analytics").getOrCreate()
df = spark.read.csv("s3://my-bucket/orders.csv", header=True, inferSchema=True)
\`\`\`

### Common transformations
\`\`\`python
# Select columns
df.select("order_id", "customer_id", "amount")

# Filter rows
df.filter(df["amount"] > 100)

# Add a column
from pyspark.sql.functions import col, year
df.withColumn("order_year", year(col("order_date")))

# Group and aggregate
df.groupBy("customer_id").agg({"amount": "sum"}).orderBy("sum(amount)", ascending=False)
\`\`\`

### SQL interface
You can also run SQL directly:
\`\`\`python
df.createOrReplaceTempView("orders")
spark.sql("SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id").show()
\`\`\``,
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the high-level, schema-aware API recommended for analytics in Spark?",
        options: ["RDD", "Dataset", "DataFrame", "GraphX"],
        correctIndex: 2,
      },
      {
        id: "q2",
        question: "Spark uses lazy evaluation. When does a transformation actually execute?",
        options: [
          "Immediately when called",
          "When an action like collect() or show() is called",
          "When the script ends",
          "When you call spark.execute()",
        ],
        correctIndex: 1,
      },
      {
        id: "q3",
        question: "Which PySpark function adds a new column to a DataFrame?",
        options: ["addColumn()", "withColumn()", "newColumn()", "insertColumn()"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "data-storytelling",
    title: "Data Storytelling & Visualization",
    description:
      "Turn raw numbers into compelling narratives. Learn how to choose the right chart, design for clarity, and communicate insights to non-technical stakeholders.",
    level: "Beginner",
    duration: "1.5 hours",
    instructor: "Richu Y.",
    tags: ["Visualization", "Storytelling", "Dashboards", "Communication"],
    modules: [
      {
        id: "m1",
        title: "Choosing the Right Chart",
        duration: "20 min",
        content: `## Choosing the Right Chart

The chart type should match what you want to communicate.

| Goal | Chart type |
|---|---|
| Compare values | Bar chart |
| Show trends over time | Line chart |
| Show part-of-whole | Pie / Donut (use sparingly) |
| Show distribution | Histogram, Box plot |
| Show correlation | Scatter plot |
| Show geographic data | Map |

### The golden rule
Ask: **"What question am I answering?"** — then choose the chart that answers it most directly.

### Common mistakes
- Using 3D charts (distorts perception)
- Truncating the Y-axis (exaggerates differences)
- Using too many colors (creates visual noise)
- Pie charts with more than 5 slices`,
      },
      {
        id: "m2",
        title: "Building a Data Narrative",
        duration: "25 min",
        content: `## Building a Data Narrative

A great data story has three parts:

### 1. Setup — What is the context?
Establish the business question. What decision needs to be made? Who is the audience?

*Example: "Our Q3 revenue grew 12% YoY, but we need to understand which product lines drove that growth."*

### 2. Conflict — What does the data reveal?
Present the key finding — often surprising or counterintuitive.

*Example: "Despite being our smallest segment by volume, premium subscriptions account for 68% of revenue growth."*

### 3. Resolution — What should we do?
Translate the insight into a clear recommendation.

*Example: "We recommend doubling down on premium tier acquisition in Q4 by reallocating 30% of growth budget."*

### Practical tips
- Lead with the insight, not the methodology
- One chart, one message
- Annotate directly on the chart — don't make readers look at a legend`,
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Which chart type is best for showing a trend over time?",
        options: ["Bar chart", "Pie chart", "Line chart", "Scatter plot"],
        correctIndex: 2,
      },
      {
        id: "q2",
        question: "What is the 'conflict' part of a data narrative?",
        options: [
          "The background context and business question",
          "The key finding from the data — often surprising",
          "The recommended action",
          "The data source and methodology",
        ],
        correctIndex: 1,
      },
      {
        id: "q3",
        question: "Which of these is a common data visualization mistake?",
        options: [
          "Using a line chart for time-series data",
          "Truncating the Y-axis to exaggerate differences",
          "Labeling chart axes",
          "Using a bar chart to compare values",
        ],
        correctIndex: 1,
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
