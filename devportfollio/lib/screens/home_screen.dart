import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/profile_provider.dart';
import '../widgets/profile_form.dart';
import '../widgets/profile_preview.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CheckMate Portfolio'),
        actions: [
          IconButton(
            icon: const Icon(Icons.preview),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ProfilePreview(),
                ),
              );
            },
          ),
        ],
      ),
      body: const SafeArea(
        child: ProfileForm(),
      ),
    );
  }
}
