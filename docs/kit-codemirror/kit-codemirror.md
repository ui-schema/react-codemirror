# Kit CodeMirror

Thin-wrapper for CodeMirror v6 to use as React Component, with hooks and stuff to build more advanced editors easily.

```bash
npm install --save @ui-schema/kit-codemirror @codemirror/state @codemirror/view

# doesn't require any other module of `@ui-schema`
```

Contains only the minimal necessities for CodeMirror to work in ReactJS, nothing more.

- supports `value` as string
- bind state changes with `onChange` - or omit it for a **read only editor**
- add native CodeMirror extensions with props

> [!CAUTION]
>
> It is important to only supply safely referenced props! Always use `useMemo`/`useCallback` and so on for extensions, function and other complex values.
>
> Otherwise, the editors extension are unnecessarily destroyed and will cause significant performance degradation or even subtle bugs.
>
> For granular control of reactive extension reconfiguration, use the `useCodeMirror` and `useExtension` hooks, check the [`CodeMirror` base component](https://github.com/ui-schema/react-codemirror/blob/main/packages/kit-codemirror/src/CodeMirror/CodeMirror.tsx) as reference.

## Components

The `CodeMirror` component serves as read-to-use ReactJS integration.

Check the `CustomCodeMirror` in [`demo/src/pages/PageDemoComponent.tsx`](../../packages/demo/src/pages/PageDemoComponent.tsx) for an example.

## Hooks

### useCodeMirror

The `useCodeMirror` hook is used by the `CodeMirror` component and can be used to built more advanced customizations easily.

Check the [`CodeMirror` component  as an example](../../packages/kit-codemirror/src/CodeMirror/CodeMirror.tsx).

### useExtension

The `useExtension` hook allows to define a setup function, which returns a configured CodeMirror extension.

> [!IMPORTANT]
>
> The `useExtension` hook can only be used when using the `useCodeMirror` hook, not with the `CodeMirror` component.

> [!IMPORTANT]
>
> The `useExtension` hook must be positioned directly after the `useCodeMirror` hook, it can not be used in parent components.

It automatically enables the extension and reconfigures it whenever the setup function changes. Always use `useCallback` for the setup function to prevent unnecessary reconfigurations.

The extension is added to the end of the editors configuration, to control the order use the `Prec` to set the precedence.

```tsx
import { Prec } from '@codemirror/state'
import { useExtension } from '@ui-schema/kit-codemirror/useExtension'

// must be called before using the `useExtension` hook
const [editorRef] = useCodeMirror(/* ... */)

// the complete code for a "editorAttributes" extension, which keeps the `class` up to date
useExtension(
    useCallback(() => {
        return Prec.lowest(EditorView.editorAttributes.of({class: classNameContent || ''}))
    }, [classNameContent]),
    editorRef,
)
```
