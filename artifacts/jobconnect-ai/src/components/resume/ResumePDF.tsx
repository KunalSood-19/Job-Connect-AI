import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  url: string;
}

interface Contact {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

interface ResumePDFProps {
  contact: Contact;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  template: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#222",
    lineHeight: 1.5,
    backgroundColor: "#FFFFFF",
  },

  header: {
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#7C3AED",
    paddingBottom: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },

  title: {
    fontSize: 13,
    color: "#7C3AED",
    marginBottom: 8,
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  contactText: {
    fontSize: 10,
    color: "#555",
  },

  section: {
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#7C3AED",
    letterSpacing: 1,
  },

  paragraph: {
    fontSize: 11,
    color: "#444",
    lineHeight: 1.6,
  },

  item: {
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemTitle: {
    fontWeight: "bold",
    fontSize: 11,
  },

  itemSubtitle: {
    color: "#555",
    marginTop: 2,
  },

  date: {
    color: "#777",
    fontSize: 10,
  },

  description: {
    marginTop: 5,
    color: "#444",
    lineHeight: 1.5,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  skill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 10,
  },

  link: {
    color: "#2563EB",
    marginTop: 3,
  },
  footer: {
  marginTop: 25,
  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
  paddingTop: 10,
  alignItems: "center",
},

footerText: {
  fontSize: 9,
  color: "#777",
},
});

export default function ResumePDF({
  contact,
  summary,
  skills,
  experience,
  education,
  projects,
  template,
}: ResumePDFProps) {
  const accent =
    template === "bold"
      ? "#10B981"
      : template === "classic"
      ? "#475569"
      : template === "minimal"
      ? "#71717A"
      : "#7C3AED";

  styles.header.borderBottomColor = accent;
  styles.sectionTitle.color = accent;
  styles.title.color = accent;

  return (
    <Document>

      <Page size="A4" style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.name}>
            {contact.name || "Your Name"}
          </Text>

          <Text style={styles.title}>
            {contact.title || "Professional Title"}
          </Text>

          <View style={styles.contactRow}>

            {contact.email && (
              <Text style={styles.contactText}>
                {contact.email}
              </Text>
            )}

            {contact.phone && (
              <Text style={styles.contactText}>
                • {contact.phone}
              </Text>
            )}

            {contact.location && (
              <Text style={styles.contactText}>
                • {contact.location}
              </Text>
            )}

          </View>

          <View style={styles.contactRow}>

            {contact.website && (
              <Link src={contact.website} style={styles.link}>
                Website
              </Link>
            )}

            {contact.linkedin && (
              <Link
                src={contact.linkedin}
                style={styles.link}
              >
                LinkedIn
              </Link>
            )}

            {contact.github && (
              <Link
                src={contact.github}
                style={styles.link}
              >
                GitHub
              </Link>
            )}

          </View>

        </View>

        {/* SUMMARY */}

        {summary && (
          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              Professional Summary
            </Text>

            <Text style={styles.paragraph}>
              {summary}
            </Text>

          </View>
        )}
{/* ===================== SKILLS ===================== */}

{skills.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Skills
    </Text>

    <View style={styles.skillsContainer}>
      {skills.map((skill, index) => (
        <Text key={index} style={styles.skill}>
          {skill}
        </Text>
      ))}
    </View>
  </View>
)}

{/* ================= EXPERIENCE ================= */}

{experience.some((e) => e.title.trim()) && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Experience
    </Text>

    {experience
      .filter((e) => e.title.trim())
      .map((exp) => (
        <View key={exp.id} style={styles.item}>

          <View style={styles.row}>

            <View>

              <Text style={styles.itemTitle}>
                {exp.title}
              </Text>

              <Text style={styles.itemSubtitle}>
                {exp.company}
                {exp.location ? ` • ${exp.location}` : ""}
              </Text>

            </View>

            <Text style={styles.date}>
              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </Text>

          </View>

          {exp.description && (
            <Text style={styles.description}>
              {exp.description}
            </Text>
          )}

        </View>
      ))}
  </View>
)}

{/* ================= PROJECTS ================= */}

{projects.some((p) => p.name.trim()) && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Projects
    </Text>

    {projects
      .filter((p) => p.name.trim())
      .map((project) => (
        <View key={project.id} style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>
              {project.name}
            </Text>

            {project.tech && (
              <Text style={styles.date}>
                {project.tech}
              </Text>
            )}
          </View>

          {project.description && (
            <Text style={styles.description}>
              {project.description}
            </Text>
          )}

          {project.url && (
            <Link
              src={project.url}
              style={styles.link}
            >
              {project.url}
            </Link>
          )}
        </View>
      ))}
  </View>
)}

{/* ================= FOOTER ================= */}

<View
  style={{
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 9,
      color: "#777",
    }}
  >
    Generated using JobConnect AI Resume Builder
  </Text>
</View>
{education.some((e) => e.degree.trim()) && (
  <View style={styles.section}>

    <Text style={styles.sectionTitle}>
      Education
    </Text>

    {education
      .filter((e) => e.degree.trim())
      .map((edu) => (
        <View key={edu.id} style={styles.item}>

          <View style={styles.row}>

            <View>

              <Text style={styles.itemTitle}>
                {edu.degree}
              </Text>

              <Text style={styles.itemSubtitle}>
                {edu.school}
                {edu.location ? ` • ${edu.location}` : ""}
              </Text>

            </View>

            <Text style={styles.date}>
              {edu.startDate} - {edu.endDate}
            </Text>

          </View>

          {edu.gpa && (
            <Text style={styles.description}>
              GPA : {edu.gpa}
            </Text>
          )}

        </View>
      ))}

  </View>
)}

      </Page>

    </Document>
  );
}