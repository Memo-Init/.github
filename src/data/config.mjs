const config = [
    {
        'replace': '{{repos}}',
        'preset': 'githubDetails',
        'projects': [
            {
                "title": "spec",
                "githubUserName": "Memo-Init",
                "githubRepository": "spec",
                "githubWorkflowPath": "generate.yml"
            },
            {
                "title": "memo-init.github.io",
                "githubUserName": "Memo-Init",
                "githubRepository": "memo-init.github.io",
                "githubWorkflowPath": "deploy.yml"
            },
            {
                "title": "viewer",
                "githubUserName": "Memo-Init",
                "githubRepository": "viewer",
                "githubWorkflowPath": "test-on-push.yml"
            },
            {
                "title": "prompt-generator",
                "githubUserName": "Memo-Init",
                "githubRepository": "prompt-generator",
                "githubWorkflowPath": "test-on-push.yml"
            }
        ]
    }
]


export { config }
