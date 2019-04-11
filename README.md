# ecg-sensor

個人實驗專案，使用 Arduino + AD8283 進行資料搜集。

以 Node.js 為後端，支援 `Windows`, `macOS`。

## 安裝

請先安裝 serialport 套件。

```sh
npm install -g @serialport/list
```

利用以下指令即可查看當前埠號使用清單。

```sh
serialport-list
```

## 環境變數

參考 `.env.example`，自行在同目錄底下建立 `.env`。
並輸入「受試者姓名」與「第幾階段實驗」。

例如：

```conf
NAME=Robby
STAGE=1
```

## 執行

如果要接收 ECG，請輸入：

```sh
yarn ecg
```

接著選擇連接埠號。

結束時則直接 `Ctrl` + `C` 中斷即可。
