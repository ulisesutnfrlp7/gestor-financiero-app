import { Alert, Platform } from 'react-native'

type DialogActionStyle = 'default' | 'cancel' | 'destructive'

interface DialogAction {
  text: string
  style?: DialogActionStyle
  onPress?: () => void | Promise<void>
}

const IS_WEB = Platform.OS === 'web'

const invokeAction = (action?: DialogAction): void => {
  if (!action?.onPress) return
  void Promise.resolve(action.onPress())
}

const getWebApi = () => {
  const g = globalThis as {
    alert?: (message?: string) => void
    confirm?: (message?: string) => boolean
  }
  return {
    alert: g.alert,
    confirm: g.confirm,
  }
}

const getMessage = (title: string, message?: string): string =>
  message ? `${title}\n\n${message}` : title

export const showDialog = (
  title: string,
  message?: string,
  buttons?: DialogAction[]
): void => {
  if (!IS_WEB) {
    Alert.alert(title, message, buttons)
    return
  }

  const webButtons = buttons ?? [{ text: 'OK' }]
  const { alert, confirm } = getWebApi()

  if (webButtons.length <= 1) {
    if (alert) {
      alert(getMessage(title, message))
    }
    invokeAction(webButtons[0])
    return
  }

  const cancelAction = webButtons.find((button) => button.style === 'cancel')
  const confirmAction =
    [...webButtons].reverse().find((button) => button.style !== 'cancel') ?? webButtons[0]

  const accepted = confirm ? confirm(getMessage(title, message)) : true
  if (accepted) {
    invokeAction(confirmAction)
    return
  }
  invokeAction(cancelAction)
}

export const showMessage = (title: string, message?: string): void => {
  showDialog(title, message, [{ text: 'OK' }])
}

export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  destructive = false
): void => {
  showDialog(title, message, [
    { text: cancelText, style: 'cancel' },
    {
      text: confirmText,
      style: destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ])
}
