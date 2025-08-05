# UI-Schema: Kit Code

Thin-wrapper for CodeMirror v6 to use as React Component, with hooks and stuff to build more advanced editors easily.

- [Documentation](https://github.com/ui-schema/react-codemirror/blob/main/docs/kit-codemirror)
- [Example Code](https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/pages/PageDemoComponent.tsx)

```tsx
import { useState, useCallback } from 'react'
import { CodeMirror } from '@ui-schema/kit-codemirror/CodeMirror'
import { isRemoteChange } from '@ui-schema/kit-codemirror/isRemoteChange'
import type { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import type { CodeMirrorComponentProps, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'

const DemoComponent = () => {
    const [value, setValue] = useState('')

    const onChange: CodeMirrorOnChange = useCallback((update, newValue) => {
        if(!update.docChanged || typeof newValue !== 'string' || isRemoteChange(update)) {
            return
        }
        setValue(newValue)
    }, [setValue])

    return <CodeMirror
        value={value}
        onChange={onChange}
    />
}
```

## License

Released under the [MIT License](https://github.com/ui-schema/react-codemirror/blob/main/LICENSE).
