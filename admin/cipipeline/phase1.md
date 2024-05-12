# Status

The overarching plan for the ci/cd pipeline is outlined in phase1.drawio. To summarize, once a developer pushes code from a pull request to the main branch, the code should be linted for style errors, checked for redundancy and other mistakes automatically. We would also have someone manually review for anything that is not automatically caught, or just to make sure that the implemented code actually performs the functionality that is required. On top of this though, we plan to implement unit and end to end testing to make sure the code is automatically checked for functionality working correctly. This double check is implemented as it is important to have a manual check on all the code being pushed as well. Finally, documentation would be generated, either stating the proper updates and that everything is working, or that there are bugs/errors somewhere and point the developers to where it is and what is going wrong. Finally the updates will be automatically deployed. We currently have the set up and unit tests implemented at this very moment. Once we have more code to actually begin testing, we will add the end to end tests and documentation features. We are also planning on implementing code quality checks, but are working on finding the exact way of actually implementing it. So the planned tests to implement for phase 1 are linting, code quality, and documentation. These should be completed by Wednesday 5/15 at the latest.