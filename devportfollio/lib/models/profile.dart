class Profile {
  final String name;
  final String title;
  final String bio;
  final String email;
  final String? github;
  final String? linkedin;
  final List<Experience> experiences;
  final List<Project> projects;
  final List<String> skills;

  Profile({
    required this.name,
    required this.title,
    required this.bio,
    required this.email,
    this.github,
    this.linkedin,
    required this.experiences,
    required this.projects,
    required this.skills,
  });

  Profile copyWith({
    String? name,
    String? title,
    String? bio,
    String? email,
    String? github,
    String? linkedin,
    List<Experience>? experiences,
    List<Project>? projects,
    List<String>? skills,
  }) {
    return Profile(
      name: name ?? this.name,
      title: title ?? this.title,
      bio: bio ?? this.bio,
      email: email ?? this.email,
      github: github ?? this.github,
      linkedin: linkedin ?? this.linkedin,
      experiences: experiences ?? this.experiences,
      projects: projects ?? this.projects,
      skills: skills ?? this.skills,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'title': title,
        'bio': bio,
        'email': email,
        'github': github,
        'linkedin': linkedin,
        'experiences': experiences.map((e) => e.toJson()).toList(),
        'projects': projects.map((p) => p.toJson()).toList(),
        'skills': skills,
      };

  factory Profile.fromJson(Map<String, dynamic> json) => Profile(
        name: json['name'],
        title: json['title'],
        bio: json['bio'],
        email: json['email'],
        github: json['github'],
        linkedin: json['linkedin'],
        experiences: (json['experiences'] as List)
            .map((e) => Experience.fromJson(e))
            .toList(),
        projects:
            (json['projects'] as List).map((p) => Project.fromJson(p)).toList(),
        skills: List<String>.from(json['skills']),
      );
}

class Experience {
  final String company;
  final String position;
  final DateTime startDate;
  final DateTime? endDate;
  final String description;
  final List<String> achievements;

  Experience({
    required this.company,
    required this.position,
    required this.startDate,
    this.endDate,
    required this.description,
    required this.achievements,
  });

  Map<String, dynamic> toJson() => {
        'company': company,
        'position': position,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate?.toIso8601String(),
        'description': description,
        'achievements': achievements,
      };

  factory Experience.fromJson(Map<String, dynamic> json) => Experience(
        company: json['company'],
        position: json['position'],
        startDate: DateTime.parse(json['startDate']),
        endDate:
            json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
        description: json['description'],
        achievements: List<String>.from(json['achievements']),
      );
}

class Project {
  final String name;
  final String description;
  final String? githubUrl;
  final String? liveUrl;
  final List<String> technologies;
  final List<String> images;

  Project({
    required this.name,
    required this.description,
    this.githubUrl,
    this.liveUrl,
    required this.technologies,
    required this.images,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'description': description,
        'githubUrl': githubUrl,
        'liveUrl': liveUrl,
        'technologies': technologies,
        'images': images,
      };

  factory Project.fromJson(Map<String, dynamic> json) => Project(
        name: json['name'],
        description: json['description'],
        githubUrl: json['githubUrl'],
        liveUrl: json['liveUrl'],
        technologies: List<String>.from(json['technologies']),
        images: List<String>.from(json['images']),
      );
}
