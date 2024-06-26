# Generated by Django 4.2.4 on 2023-10-25 13:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Musician', '0001_initial'),
        ('album', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Music',
            fields=[
                ('MusicID', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('S3Info', models.CharField(blank=True, max_length=255, null=True)),
                ('S3Lrc', models.CharField(blank=True, max_length=255, null=True)),
                ('S3Music', models.CharField(blank=True, max_length=255, null=True)),
                ('Only_for_vip', models.BooleanField(default=False)),
                ('S3Image', models.CharField(blank=True, max_length=255, null=True)),
                ('S3MV', models.CharField(blank=True, max_length=255, null=True)),
                ('click_count', models.PositiveIntegerField(default=0, help_text='Number of times the music has been played or accessed.')),
                ('is_active', models.BooleanField(default=False, help_text='Whether the song is active or not.')),
                ('Album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='album.album')),
                ('Musician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Musician.musician')),
            ],
        ),
    ]
