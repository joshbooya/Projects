Sub stockanalysis()
    Dim lR As Long
    Dim n As Long
    Dim interval As Long
    Dim like_rows As Long
    
    Dim vol As Double
    Dim price_1 As Double
    Dim price_delta As Double
    Dim daily_delta As Double
    ' Worksheet declared & set
    Dim ws1 As Worksheet
    Set ws1 = Worksheets(1)
    
    ' Worksheet declared & set
    Dim ws2 As Worksheet
    Set ws2 = Sheets.Add(After:=Sheets(Sheets.Count))
    ws2.Name = "Analysis"

    lR = ws1.Cells(Rows.Count, 1).End(xlUp).Row
    n = 0
    interval = 0
    like_rows = 1
    vol = ws1.Cells(2, 7).Value
    price_1 = ws1.Cells(2,3).Value
    daily_delta = ws1.Cells(2,4).Value - ws1.Cells(2,5).Value
    
        For i = 2 To lR
            If ws1.Cells(i + 1, 1).Value = ws1.Cells(i, 1).Value Then
                
                'This ads successively the volumes traded from the same stock
                vol = vol + ws1.Cells(i + 1, 7).Value
                
                'Counts the # of similar stocks FROM the initial stock
                interval = interval + 1
                
                'Counts the # of rows for the similar stocks
                like_rows = like_rows + 1
                daily_delta = daily_delta + (ws1.Cells(i + 1,4).Value - ws1.Cells(i + 1,5).Value)

                
            ElseIf ws1.Cells(i + 1, 1).Value <> ws1.Cells(i, 1).Value Then
                'Counts up the unique # of stocks
                n = n + 1

                ' ** The ticker symbol in column A
                'Prints new stock ticker to column 10
                ws2.Cells(n + 1, 1).Value = ws1.Cells(i, 1).Value
                                
                'Calculates the change in stock value 
                price_delta = ws1.Cells(i , 6).Value - ws1.Cells(i - interval, 3).Value 
                ' DO NOT RUN THIS OR YOU WILL PRESS "ENTER" +3,000 times - MsgBox ("There are " & interval & " rows that are similar to " & Cells(i, 1).Value)
                

                '  ** Total change in the stock in column B
                'Prints out the change in stock
                ws2.Cells(n + 1, 2).Value = price_delta
                
                If price_delta < 0 Then
                    ws2.Cells(n + 1, 2).Interior.ColorIndex = 3
                Else
                    ws2.Cells(n + 1, 2).Interior.ColorIndex = 4
                End If


                '  ** The Percent of change in column C
                ws2.Cells(n + 1, 3).Value = (price_delta/ws1.Cells(i - interval, 3).Value)
                

                'This changes the format of the output on column C into % format
                ws2.Cells(n + 1, 3).NumberFormat = "00.00%"


                '  ** Average Daily change in column D
                ws2.Cells(n + 1, 4).Value = daily_delta/like_rows
                daily_delta = ws1.Cells(i + 1,4).Value - ws1.Cells(i + 1,5).Value
                like_rows = 1


                'Resets the counter when a new stock is observed
                interval = 0


                ' ** Total volume of trade in column E
                'Prints out the total volume per unique stock
                ws2.Cells(n + 1, 5).Value = vol                

                'Resets the new starting volume of the new stock ticker
                vol = ws1.Cells(i + 1, 7).Value
            End If
        Next i

    ' ** Greatest Volume, % incr, % decr, and avg. change in column H 
    '       and the ticker symbol for each in column J.

    Dim lR2 As Long
    Dim greatest_vol As Double
    Dim greatest_incr As Double
    Dim largest_decr As Double
    Dim avg_change As Double

    Dim max_vol As Range
    Dim mincr As Range
    Dim mdecr As Range
    Dim mchange As Range
    Dim lRow As Long
        
    Worksheets("Analysis").Activate 
    Cells(1, 1).Value = "Ticker"
    Cells(1, 2).Value = "Total Change"
    Cells(1, 3).Value = "% Change"
    Cells(1, 4).Value = "Avg. Daily Change"
    Cells(1, 5).Value = "Volume"

    Cells(2, 7).Value = "Greatest volume"
    Cells(3, 7).Value = "Greatest % Increase"
    Cells(4, 7).Value = "Greatest % Decrease"
    Cells(5, 7).Value = "Greatest Avg Change"

    lR2 = Cells(Rows.Count, 1).End(xlUp).Row
    greatest_vol = WorksheetFunction.Max(Range("E2:E" & lR2))
    greatest_incr = WorksheetFunction.Max(Range("C2:C" & lR2))
    largest_decr = WorksheetFunction.Min(Range("C2:C" & lR2))
    avg_change = WorksheetFunction.Max(Range("D2:D" & lR2))

    ' MsgBox ("There are " & n & " unique Credit cards " _
    ' & vbNewLine & "Your greatest vol is " & greatest_vol _
    ' & vbNewLine & "Your greatest stock increase is " & greatest_incr _
    ' & vbNewLine & "Your largest stock decrease is " & largest_decr _
    ' & vbNewLine & "Your average stock change is " & avg_change)
        
    Cells(2, 8).Value = greatest_vol
    Cells(3, 8).Value = greatest_incr
    Cells(4, 8).Value = largest_decr
    Cells(5, 8).Value = avg_change

    'Format the max & min growth perecentages
    Cells(3, 8).NumberFormat = "00.00%"
    Cells(4, 8).NumberFormat = "00.00%"

    Setting range object to print out the stock ticker associated
    Set max_vol = Range("E2:E" & lR2).Find(What:= greatest_vol)
    Set mincr = Range("C2:C" & lR2).Find(What:= greatest_incr)
    Set mdecr = Range("C2:C" & lR2).Find(What:= largest_decr)
    Set mchange = Range("C2:C" & lR2).Find(What:= avg_change)

    'Prints stock ticker associated to the greatest vol, incr, decr, & change
    Cells(2, 10).Value = max_vol.Offset(0,-4).Value
    Cells(3, 10).Value = mincr.Offset(0,-2).Value
' Error from line 149 - if comment out all code after line 149 then line 148 will error out in the same way
' Run-time error '91':

' Object variable or With block variable not set

    'Alternate coding to line 149
    '   lRow = Range("E2:E" & lR2).Find(What:= greatest_incr, _
    '                     LookIn:=xlValues, _
    '                     LookAt:=xlWhole, _
    '                     SearchOrder:=xlByRows, _
    '                     MatchCase:=True)
    '   Cells(3, 10).Value = Range("A"&lRow).Value

    Cells(4, 10).Value = mdecr.Offset(,-2).Value
    Cells(5, 10).Value = mchange.Offset(,-3).Value
End Sub