package ro.medCare.service;
import ro.medCare.dto.ReportDTO;

import java.io.File;

public interface ReportExporter {
    File export(ReportDTO report) throws Exception;
}