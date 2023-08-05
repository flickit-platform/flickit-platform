from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0020_auto_20230611_1753'),
    ]

    operations = [
            migrations.RenameField(model_name='MetricValue',old_name='metric',new_name='question'),
            migrations.RenameField(model_name='EvidenceRelation',old_name='metric',new_name='question'),
            ]
