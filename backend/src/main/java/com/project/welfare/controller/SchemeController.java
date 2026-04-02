package com.project.welfare.controller;

import com.project.welfare.Entity.Scheme;
import com.project.welfare.dto.SchemeListDto;
import com.project.welfare.service.SchemeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public List<SchemeListDto> getAllSchemes() {
        return schemeService.getAllSchemes();
    }

    @GetMapping("/{id}")
    public Scheme getSchemeById(@PathVariable int id) {
        return schemeService.getSchemeById(id);
    }

    @PostMapping
    public Scheme addScheme(@RequestBody Scheme scheme) {
        return schemeService.addScheme(scheme);
    }
}
