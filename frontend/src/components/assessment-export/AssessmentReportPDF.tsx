import React, { FC, Fragment, useEffect, useState } from "react";
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
import { Trans } from "react-i18next";

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
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 12,
    margin: 12,
  },
  description: {
    fontSize: 10,
    margin: 12,
  },
  table: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#404040",
  },
  container: {
    flexDirection: "row",
    borderBottomColor: "#404040",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  member: {
    width: "75%",
    borderRightColor: "#1a1a1a",
    borderRightWidth: 1,
  },
  amount: {
    width: "25%",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    width: "33.33%", // Adjusted to three columns
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    padding: 3,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#ccc", // Header background color
    color: "#000", // Header text color
    fontSize: 14
  },
  tableCell: {
    width: "33.33%", // Adjusted to three columns
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    padding: 3,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12
  },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  image: {
    width: 80,
    height: 80,
  },
  chart: {
    width: 540,
  },
  titleLarge: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  displaySmall: {
    fontSize: 12,
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
  assessmentKitInfo: any;
  data: any;
  progress: any;
}

const AssessmentReportPDF: FC<AssessmentReportPDFProps> = ({
  assessmentKitInfo,
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

      if (window.innerWidth < 600) return;

      setChartImages(chartImageUrls.filter(Boolean) as string[]);

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

  const { questionnaires, questionnairesCount } = assessmentKitInfo;
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
          <Text style={styles.titleLarge}>
            <Trans i18nKey="assessmentMethodology" />
          </Text>
          <Text style={styles.displaySmall}>
            <Trans
              i18nKey="assessmentMethodologyDescription"
              values={{
                title: assessment?.title,
                subjects: subjects
                  ?.map((elem: ISubject, index: number) =>
                    index === 0
                      ? elem?.title + "quality attributes"
                      : index === 1
                        ? elem?.title + " dynamics"
                        : elem?.title
                  )
                  ?.join(", "),
                maturityLevelsCount:
                  assessment.assessmentKit.maturityLevelCount ?? 5,
              }}
            />
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="title" />
              </Text>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="description" />
              </Text>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="level" />
              </Text>
            </View>

            {/* Table Body */}
            {assessment?.assessmentKit?.maturityLevels.map(
              (maturityLevel: IMaturityLevel, index: number) => (
                <Fragment>
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{maturityLevel?.title}</Text>
                    <Text style={styles.tableCell}>{maturityLevel?.value}</Text>
                    <Text style={styles.tableCell}>
                      {" "}
                      {maturityGaugeImages.length !== 0 && (
                        <Image
                          style={styles.image}
                          src={maturityGaugeImages[index]}
                        />
                      )}
                    </Text>
                  </View></Fragment>
              )
            )}
          </View>
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
          Page 1 of 4
        </Text>

      </Page>

      {/* Second Page */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.section}>
          <Text style={styles.titleLarge}>
            <Trans i18nKey="assessmentFocus" />
          </Text>
          <Text style={styles.displaySmall}>
            <Trans
              i18nKey="assessmentFocusDescription"
              values={{
                subjectsCount: subjects.length,
                subjects: subjects
                  ?.map((elem: ISubject, index: number) =>
                    index === subjects.length - 1
                      ? " and " + elem?.title
                      : index === 0
                        ? elem?.title
                        : ", " + elem?.title
                  )
                  ?.join(""),
                attributesCount: subjects.reduce(
                  (previousValue: number, currentValue: ISubject) => {
                    return previousValue + currentValue.attributes.length;
                  },
                  0
                ),
              }}
            />
          </Text>
          {subjects?.map((subject: ISubject) => (
            <Text style={styles.displaySmall}>
              <Trans
                i18nKey="assessmentFocusDescriptionSubject"
                values={{
                  title: subject.title,
                  description: subject.description,
                }}
              />
            </Text>
          ))}
          <Text style={styles.displaySmall}>
            {" "}
            <Trans i18nKey="assessmentFocusDescriptionLastSection" />
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="assessmentSubject" />
              </Text>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="assessmentAttribute" />
              </Text>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="description" />
              </Text>
            </View>

            {/* Table Body */}
            {subjects?.map((subject: ISubject, index: number) => (
              <>
                {subject?.attributes?.map((feature, featureIndex) => (
                  <Fragment>
                    <View style={styles.tableRow} key={featureIndex}>
                      <Text style={styles.tableCell}>
                        <Text>{featureIndex === 0 ? subject?.title : ""}</Text>
                        <Text>
                          {featureIndex === 0 ? subject?.description : ""}
                        </Text>
                      </Text>
                      <Text style={styles.tableCell}>{feature?.title}</Text>
                      <Text style={styles.tableCell}>{feature?.description}</Text>
                    </View>
                  </Fragment>
                ))}
              </>
            ))}
          </View>
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
          Page 2 of 4
        </Text>
      </Page>
      <Page size="A4" style={styles.page}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.titleLarge}>
            <Trans i18nKey="questionnaires" />
          </Text>
          <Text style={styles.displaySmall}>
            <Trans
              i18nKey="questionnairesDescription"
              values={{ questionnairesCount, questionsCount }}
            />
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="number" />
              </Text>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="questionnaire" />
              </Text>
              <Text style={styles.tableCellHeader}>
                {" "}
                <Trans i18nKey="description" />
              </Text>
            </View>

            {/* Table Body */}
            {questionnaires?.map((questionnaire: ISubject, index: number) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{questionnaire?.title}</Text>
                <Text style={styles.tableCell}>{questionnaire?.description}</Text>
              </View>
            ))}
          </View>
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
          Page 3 of 4
        </Text>
      </Page>
      {subjects?.map((subject: ISubject, index: number) => (
        <Page size="A4" style={styles.page}>
          <Header />

          <Text style={styles.titleLarge}>
            {" "}
            <Trans
              i18nKey="subjectStatusReport"
              values={{ title: subject?.title }}
            />
          </Text>
          <Text style={styles.displaySmall}>
            {" "}
            <Trans
              i18nKey="subjectStatusReportDescription"
              values={{
                title: subject?.title,
                description: subject?.description,
                confidenceValue: Math?.ceil(subject?.confidenceValue ?? 0),
                maturityLevelValue: subject?.maturityLevel?.value,
                maturityLevelTitle: subject?.maturityLevel?.title,
                maturityLevelCount: assessmentKit.maturityLevelCount ?? 5,
                attributesCount: subject?.attributes?.length,
              }}
            />
          </Text>
          {tableImages.length !== 0 && (
            <Image style={styles.chart} src={tableImages[index]} />
          )}
          {chartImages.length !== 0 && (
            <Image style={styles.chart} src={chartImages[index]} />
          )}
          <Text
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
            }}
          >
            Page 4 of 4
          </Text>
        </Page>
      ))}
      {/* <View style={styles.section}>{renderSubjectsTable()}</View> */}

    </Document>
  );
};

export default AssessmentReportPDF;
