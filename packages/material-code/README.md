# UI-Schema: DS Material-UI, Code Editor

Code Editor (codemirror) to work with [@ui-schema/ui-schema](https://github.com/ui-schema/ui-schema), using [@material-ui](https://github.com/mui-org/material-ui/).

[![Documentation](https://img.shields.io/badge/Component%20Documentation-blue?labelColor=fff&style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9InN2ZzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9ImJhY2tncm91bmQiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMzIiIHdpZHRoPSIzMi4wMDEiLz48L2c+PGcgaWQ9ImJvb2tfeDVGX3RleHRfeDVGX3NldHRpbmdzIj48cGF0aCBkPSJNMzIsMjMuMDAxYzAtMy45MTctMi41MDYtNy4yNC01Ljk5OC04LjQ3N1Y0aC0yVjEuOTk5aDJWMGgtMjNDMi45MTgsMC4wMDQsMi4yOTQtMC4wMDgsMS41NTYsMC4zNTQgICBDMC44MDgsMC42ODYtMC4wMzQsMS42NDUsMC4wMDEsM2MwLDAuMDA2LDAuMDAxLDAuMDEyLDAuMDAxLDAuMDE4VjMwYzAsMiwyLDIsMiwyaDIxLjA4MWwtMC4wMDctMC4wMDQgICBDMjguMDEzLDMxLjk1NSwzMiwyNy45NDYsMzIsMjMuMDAxeiBNMi44NTMsMy45ODFDMi42NzUsMy45NTUsMi40MTgsMy44NjksMi4yNzQsMy43NDNDMi4xMzYsMy42MDksMi4wMTcsMy41LDIuMDAyLDMgICBjMC4wMzMtMC42NDYsMC4xOTQtMC42ODYsMC40NDctMC44NTZjMC4xMy0wLjA2NSwwLjI4OS0wLjEwNywwLjQwNC0wLjEyNUMyLjk3LDEuOTk3LDMsMi4wMDUsMy4wMDIsMS45OTloMTlWNGgtMTkgICBDMyw0LDIuOTcsNC4wMDIsMi44NTMsMy45ODF6IE00LDMwVjZoMjB2OC4wNkMyMy42NzEsMTQuMDIzLDIzLjMzNywxNCwyMi45OTgsMTRjLTIuMTQyLDAtNC4xMDYsMC43NTEtNS42NTEsMkg2djJoOS41MTYgICBjLTAuNDEzLDAuNjE2LTAuNzQzLDEuMjg5LTAuOTk1LDJINnYyaDguMDU3Yy0wLjAzNiwwLjMyOS0wLjA1OSwwLjY2Mi0wLjA1OSwxLjAwMWMwLDIuODI5LDEuMzA3LDUuMzUsMy4zNDgsNi45OTlINHogTTIzLDMwICAgYy0zLjg2NS0wLjAwOC02Ljk5NC0zLjEzNS03LTYuOTk5YzAuMDA2LTMuODY1LDMuMTM1LTYuOTk1LDctN2MzLjg2NSwwLjAwNiw2Ljk5MiwzLjEzNSw3LDdDMjkuOTkyLDI2Ljg2NSwyNi44NjUsMjkuOTkyLDIzLDMweiAgICBNMjIsMTJINnYyaDE2VjEyeiIvPjxwYXRoIGQ9Ik0yOCwyNHYtMi4wMDFoLTEuNjYzYy0wLjA2My0wLjIxMi0wLjE0NS0wLjQxMy0wLjI0NS0wLjYwNmwxLjE4Ny0xLjE4N2wtMS40MTYtMS40MTVsLTEuMTY1LDEuMTY2ICAgYy0wLjIyLTAuMTIzLTAuNDUyLTAuMjIxLTAuNjk3LTAuMjk0VjE4aC0ydjEuNjYyYy0wLjIyOSwwLjA2OC0wLjQ0NiwwLjE1OC0wLjY1MiwwLjI3bC0xLjE0MS0xLjE0bC0xLjQxNSwxLjQxNWwxLjE0LDEuMTQgICBjLTAuMTEyLDAuMjA3LTAuMjAyLDAuNDI0LTAuMjcxLDAuNjUzSDE4djJoMS42NjJjMC4wNzMsMC4yNDYsMC4xNzIsMC40NzksMC4yOTUsMC42OThsLTEuMTY1LDEuMTYzbDEuNDEzLDEuNDE2bDEuMTg4LTEuMTg3ICAgYzAuMTkyLDAuMTAxLDAuMzk0LDAuMTgyLDAuNjA1LDAuMjQ1VjI4SDI0di0xLjY2NWMwLjIyOS0wLjA2OCwwLjQ0NS0wLjE1OCwwLjY1MS0wLjI3bDEuMjEyLDEuMjEybDEuNDE0LTEuNDE2bC0xLjIxMi0xLjIxICAgYzAuMTExLTAuMjA2LDAuMjAxLTAuNDIzLDAuMjctMC42NTFIMjh6IE0yMi45OTksMjQuNDk5Yy0wLjgyOS0wLjAwMi0xLjQ5OC0wLjY3MS0xLjUwMS0xLjVjMC4wMDMtMC44MjksMC42NzItMS40OTgsMS41MDEtMS41MDEgICBjMC44MjksMC4wMDMsMS40OTgsMC42NzIsMS41LDEuNTAxQzI0LjQ5NywyMy44MjgsMjMuODI4LDI0LjQ5NywyMi45OTksMjQuNDk5eiIvPjwvZz48L3N2Zz4=)](https://ui-schema.bemit.codes/docs/material-code/material-code)

[![Join UI-Schema on Slack](https://img.shields.io/badge/Join%20UI%20Schema%20on%20Slack-blue?labelColor=fff&logoColor=505050&color=7B16FF&style=for-the-badge&logo=slack)](https://join.slack.com/t/ui-schema/shared_invite/zt-smbsybk5-dFIRLEPCJerzDwtycaA71w)

Supports:

- CodeMirror v5 up to `0.4.0-alpha.1`
    - react integration of `codemirror`:
        - using `react-codemirror2` up to `0.4.0-alpha.0`
        - using a modified (and included) copy of `react-codemirror2` for `0.4.0-alpha.1`
- CodeMirror v6 since `0.4.0-beta.0`
    - react integration of `@codemirror/*` with `@ui-schema/kit-codemirror`

---

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](https://github.com/ui-schema/ui-schema/blob/master/LICENSE).

© 2022 bemit UG (haftungsbeschränkt)

### License Icons

The icons in the badges of the readme's are either from [simpleicons](https://simpleicons.org) or are licensed otherwise:

- [Play Icon © Chanut is Industries, CC BY 3.0](https://www.iconfinder.com/icons/928430/go_media_music_play_playing_start_icon)
- [Experiment Icon © Ardiansyah Ardi, CC BY 3.0](https://www.iconfinder.com/icons/4951169/chemical_experiment_glass_lab_medical_icon)
- [Doc Icons © PICOL, CC BY 3.0](https://www.iconfinder.com/iconsets/picol-vector)

### Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the MIT License attached to the repository.

***

Created by [Michael Becker](https://i-am-digital.eu)