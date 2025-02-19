 # Number of worker processes
workers = 4

# Type of worker to use
worker_class = 'sync'

# Maximum requests before worker restart
max_requests = 1000
max_requests_jitter = 50

# Timeout configs
timeout = 30
keep_alive = 5

# Log configs
accesslog = '-'
errorlog = '-'
loglevel = 'info'