type Props = {
  src: string
  preload?: string
} & React.DetailedHTMLProps<React.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>

const WebView = (props: Props) => {
  const { src, preload, ...other } = props

  return (
    // eslint-disable-next-line react/no-unknown-property
    <webview src={src} preload={preload} {...other}></webview>
  )
}

export default WebView
