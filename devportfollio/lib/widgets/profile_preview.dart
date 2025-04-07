import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/profile_provider.dart';
import '../models/profile.dart';
import 'package:url_launcher/url_launcher.dart';

class ProfilePreview extends StatelessWidget {
  const ProfilePreview({super.key});

  @override
  Widget build(BuildContext context) {
    final profile = context.watch<ProfileProvider>().profile;

    if (profile == null) {
      return const Center(child: Text('No profile data available'));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile Preview'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildHeader(context, profile),
            _buildBio(context, profile),
            if (profile.experiences.isNotEmpty) _buildExperiences(profile),
            if (profile.projects.isNotEmpty) _buildProjects(profile),
            if (profile.skills.isNotEmpty) _buildSkills(profile),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, Profile profile) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).colorScheme.primary,
      child: Column(
        children: [
          const CircleAvatar(
            radius: 50,
            child: Icon(Icons.person, size: 50),
          ),
          const SizedBox(height: 16),
          Text(
            profile.name,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            profile.title,
            style: const TextStyle(
              fontSize: 18,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (profile.github != null)
                IconButton(
                  icon: const Icon(Icons.code, color: Colors.white),
                  onPressed: () => _launchUrl(profile.github!),
                ),
              if (profile.linkedin != null)
                IconButton(
                  icon: const Icon(Icons.link, color: Colors.white),
                  onPressed: () => _launchUrl(profile.linkedin!),
                ),
              IconButton(
                icon: const Icon(Icons.email, color: Colors.white),
                onPressed: () => _launchUrl('mailto:${profile.email}'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBio(BuildContext context, Profile profile) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Text(
        profile.bio,
        style: Theme.of(context).textTheme.bodyLarge,
      ),
    );
  }

  Widget _buildExperiences(Profile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Experience',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        ...profile.experiences.map((exp) => _ExperienceCard(experience: exp)),
      ],
    );
  }

  Widget _buildProjects(Profile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Projects',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        ...profile.projects.map((proj) => _ProjectCard(project: proj)),
      ],
    );
  }

  Widget _buildSkills(Profile profile) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Skills',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: profile.skills
                .map((skill) => Chip(label: Text(skill)))
                .toList(),
          ),
        ],
      ),
    );
  }

  Future<void> _launchUrl(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    }
  }
}

class _ExperienceCard extends StatelessWidget {
  final Experience experience;

  const _ExperienceCard({required this.experience});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              experience.position,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              experience.company,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8),
            Text(experience.description),
            if (experience.achievements.isNotEmpty) ...[
              const SizedBox(height: 8),
              const Text(
                'Key Achievements:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              ...experience.achievements
                  .map((achievement) => Text('• $achievement')),
            ],
          ],
        ),
      ),
    );
  }
}

class _ProjectCard extends StatelessWidget {
  final Project project;

  const _ProjectCard({required this.project});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              project.name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(project.description),
            if (project.technologies.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: project.technologies
                    .map((tech) => Chip(
                          label: Text(tech),
                          backgroundColor:
                              Theme.of(context).colorScheme.secondary,
                          labelStyle: const TextStyle(color: Colors.white),
                        ))
                    .toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
