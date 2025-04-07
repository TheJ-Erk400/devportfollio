import 'package:flutter/foundation.dart';
import '../models/profile.dart';

class ProfileProvider with ChangeNotifier {
  Profile? _profile;

  Profile? get profile => _profile;

  void updateProfile(Profile profile) {
    _profile = profile;
    notifyListeners();
  }

  void updatePersonalInfo({
    String? name,
    String? title,
    String? bio,
    String? email,
    String? github,
    String? linkedin,
  }) {
    if (_profile == null) return;

    _profile = _profile!.copyWith(
      name: name,
      title: title,
      bio: bio,
      email: email,
      github: github,
      linkedin: linkedin,
    );
    notifyListeners();
  }

  void addExperience(Experience experience) {
    if (_profile == null) return;

    final experiences = List<Experience>.from(_profile!.experiences)
      ..add(experience);
    _profile = _profile!.copyWith(experiences: experiences);
    notifyListeners();
  }

  void addProject(Project project) {
    if (_profile == null) return;

    final projects = List<Project>.from(_profile!.projects)..add(project);
    _profile = _profile!.copyWith(projects: projects);
    notifyListeners();
  }
}
