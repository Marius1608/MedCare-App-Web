package ro.medCare.service;

import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import ro.medCare.dto.ReportDTO;
import ro.medCare.model.Doctor;
import ro.medCare.model.MedicalService;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
public class XMLReportExporter implements ReportExporter {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public File export(ReportDTO report) throws Exception {

        Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();

        Element root = doc.createElement("statisticsReport");
        doc.appendChild(root);

        Element meta = doc.createElement("reportPeriod");
        root.appendChild(meta);
        addElement(doc, meta, "startDate", report.getStartDate().format(DATE_FORMAT));
        addElement(doc, meta, "endDate", report.getEndDate().format(DATE_FORMAT));

        Element doctorsStats = doc.createElement("topDoctors");
        root.appendChild(doctorsStats);

        for (Map.Entry<Doctor, Long> entry : report.getDoctorStatistics().entrySet()) {
            Element doctorEl = doc.createElement("doctor");
            doctorsStats.appendChild(doctorEl);

            addElement(doc, doctorEl, "name", entry.getKey().getName());
            addElement(doc, doctorEl, "specialization", entry.getKey().getSpecialization());
            addElement(doc, doctorEl, "appointmentsCount", String.valueOf(entry.getValue()));
        }

        Element servicesStats = doc.createElement("topServices");
        root.appendChild(servicesStats);

        for (Map.Entry<MedicalService, Long> entry : report.getServiceStatistics().entrySet()) {
            Element serviceEl = doc.createElement("service");
            servicesStats.appendChild(serviceEl);
            addElement(doc, serviceEl, "name", entry.getKey().getName());
            addElement(doc, serviceEl, "price", String.valueOf(entry.getKey().getPrice()));
            addElement(doc, serviceEl, "appointmentsCount", String.valueOf(entry.getValue()));
        }

        File xmlFile = File.createTempFile("statistics_", ".xml");
        TransformerFactory.newInstance().newTransformer().transform(
                new DOMSource(doc), new StreamResult(xmlFile));

        return xmlFile;
    }

    private void addElement(Document doc, Element parent, String name, String value) {
        Element element = doc.createElement(name);
        element.setTextContent(value);
        parent.appendChild(element);
    }
}