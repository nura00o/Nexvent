package com.example.nexvent.controller;

import com.example.nexvent.model.Category;
import com.example.nexvent.repository.CategoryRepository;
import com.example.nexvent.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
  private final AdminService admin;
  private final CategoryRepository cats;

  @GetMapping("/stats/overview")
  public Map<String,Object> overview() { return admin.overview(); }

  @PostMapping("/categories")
  public Category createCategory(@RequestParam String name) {
    Category c = new Category(); c.setName(name);
    return cats.save(c);
  }

  @PatchMapping("/users/{id}/lock")
  public void lock(@PathVariable Long id) { admin.setLock(id, true); }

  @PatchMapping("/users/{id}/unlock")
  public void unlock(@PathVariable Long id) { admin.setLock(id, false); }
}
