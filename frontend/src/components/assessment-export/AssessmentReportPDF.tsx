import React, { FC, useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { IMaturityLevel, ISubject } from "@/types";
import useScreenResize from "@/utils/useScreenResize";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  headerText: {
    fontSize: 12,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  description: {
    fontSize: 12,
    margin: 12,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    width: "33.33%", // Adjusted to three columns
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#ccc", // Header background color
    color: "#000", // Header text color
  },
  tableCell: {
    width: "25%", // Adjusted to three columns
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
  },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  image: {
    width: 100,
    height: 100,
  },
  chart: {
    width: 540,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  displaySmall: {
    fontSize: 18,
    marginBottom: 10,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableBody: {
    fontSize: 12,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 5,
  },
});

interface AssessmentReportPDFProps {
  data: any;
  progress: any;
}

const AssessmentReportPDF: FC<AssessmentReportPDFProps> = ({
  data,
  progress,
}) => {
  const [chartImages, setChartImages] = useState<string[]>([]);
  const [maturityGaugeImages, setMaturityGaugeImages] = useState<string[]>([]);
  const [tableImages, setTableImages] = useState<string[]>([]);

  useEffect(() => {
    const generateImages = async () => {
      // Select all recharts-wrapper and gauge elements
      const generateImageFromElement = async (
        element: Element,
        isGauge: boolean,
        needParentNode: boolean
      ) => {
        const parentNode = needParentNode ? element.parentNode : element;

        if (!parentNode) return null;

        try {
          const canvas = await html2canvas(parentNode as HTMLElement);
          return canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Error generating image from HTML:", error);
          return null;
        }
      };

      const chartInstances = document.querySelectorAll(".recharts-wrapper");
      const gaugeInstances = document.querySelectorAll(".gauge");
      const gaugePromises = Array.from(gaugeInstances).map((instance) =>
        generateImageFromElement(instance, true, true)
      );
      const chartPromises = Array.from(chartInstances).map((instance) =>
        generateImageFromElement(instance, false, true)
      );
      const chartImageUrls = await Promise.all(chartPromises);

      const gaugeImageUrls = await Promise.all(gaugePromises);
      setMaturityGaugeImages(gaugeImageUrls.filter(Boolean) as string[]);
      setChartImages(chartImageUrls.filter(Boolean) as string[]);

      if (window.innerWidth < 600) return;

      // Create promises to generate images for all chart and gauge instances

      const tableInstances = document.querySelectorAll(".checkbox-table");

      const tablePromises = Array.from(tableInstances).map((instance) =>
        generateImageFromElement(instance, true, false)
      );

      // Wait for all image promises to resolve
      const tableImageUrls = await Promise.all(tablePromises);

      // Update state with non-null image URLs
      setTableImages(tableImageUrls.filter(Boolean) as string[]);
    };

    // Run the image generation after the component mounts
    setTimeout(generateImages, 500); // Adjust timeout as needed
  }, []);

  const { status, assessment, subjects } = data || {};
  const { assessmentKit, maturityLevel, confidenceValue } = assessment || {};
  const { questionsCount, answersCount } = progress;

  const totalProgress = ((answersCount || 0) / (questionsCount || 1)) * 100;

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{assessment.title} Report</Text>
      <Text style={styles.headerText}>
        Generated on: {new Date().toLocaleString()}
      </Text>
    </View>
  );

  // Render subjects as a table
  const renderSubjectsTable = () => {
    if (!subjects || subjects.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.title}>Qualitative Classification</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Classification</Text>
            <Text style={styles.tableCellHeader}>Score</Text>
            <Text style={styles.tableCellHeader}>Description Level</Text>
          </View>

          {/* Table Body */}
          {assessment?.assessmentKit?.maturityLevels.map(
            (maturityLevel: IMaturityLevel, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{maturityLevel?.title}</Text>
                <Text style={styles.tableCell}>{maturityLevel?.value}</Text>
                <Text style={styles.tableCell}>{maturityLevel?.index}</Text>
              </View>
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.section}>
          <Text style={styles.titleLarge}>Evaluation Criteria</Text>
          <Text style={styles.displaySmall}>
            In this evaluation, {subjects?.length} subjects:{" "}
            {subjects?.map((elem: ISubject) => elem?.title)?.join(", ")} were
            assessed. The table below provides a detailed definition of these
            subjects and the qualitative features evaluated for each.
          </Text>
        </View>
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
          }}
        >
          Page 1 of 2
        </Text>
      </Page>

      {/* Second Page */}
      <Page size="A4" style={styles.page}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.title}>
            {" "}
            Evaluation Subjects and Qualitative Features
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Subject</Text>
              <Text style={styles.tableCellHeader}>Explanation</Text>
              <Text style={styles.tableCellHeader}>Qualitative Feature</Text>
              <Text style={styles.tableCellHeader}>Explanation</Text>
            </View>

            {/* Table Body */}
            {subjects?.map((subject: ISubject, index: number) => (
              <>
                {subject?.attributes?.map((feature, featureIndex) => (
                  <View style={styles.tableRow} key={featureIndex}>
                    <Text style={styles.tableCell}>
                      {featureIndex === 0 ? subject?.title : ""}
                    </Text>
                    <Text style={styles.tableCell}>
                      {featureIndex === 0 ? subject?.description : ""}
                    </Text>
                    <Text style={styles.tableCell}>{feature?.title}</Text>
                    <Text style={styles.tableCell}>{feature?.description}</Text>
                  </View>
                ))}
              </>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Qualitative Classification</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Classification</Text>
              <Text style={styles.tableCellHeader}>Score</Text>
              <Text style={styles.tableCellHeader}>Description </Text>
              <Text style={styles.tableCellHeader}> Level</Text>
            </View>

            {/* Table Body */}
            {assessment?.assessmentKit?.maturityLevels.map(
              (maturityLevel: IMaturityLevel, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{maturityLevel?.title}</Text>
                  <Text style={styles.tableCell}>{maturityLevel?.value}</Text>
                  <Text style={styles.tableCell}>{maturityLevel?.index}</Text>
                  <Text style={styles.tableCell}>
                    {" "}
                    {maturityGaugeImages.length !== 0 && (
                      <Image
                        style={styles.image}
                        src={maturityGaugeImages[index]}
                      />
                    )}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
        <View style={styles.section}>
          {subjects?.map((subject: ISubject, index: number) => (
            <>
              <Text style={styles.title}>{subject.title}</Text>
              {tableImages.length !== 0 && (
                <Image style={styles.chart} src={tableImages[index]} />
              )}
              {chartImages.length !== 0 && (
                <Image style={styles.chart} src={chartImages[index]} />
              )}
            </>
          ))}
        </View>
        {/* <View style={styles.section}>{renderSubjectsTable()}</View> */}
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
          }}
        >
          Page 2 of 2
        </Text>
      </Page>
    </Document>
  );
};

export default AssessmentReportPDF;
