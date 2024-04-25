CELERY_BEAT_SCHEDULE = {
    'clean-expired-codes-every-hour': {
        'task': 'your_project.tasks.clean_expired_codes',
        'schedule': 3600,  # 每小时执行一次
    },
}