/*
* 定义数据库的增删查改接口*/

class database_interface{
    constructor(){

    }

    /*增*/

    //table:插入的表,data(字典格式【key:value】):插入的数据
    insert(table,data)
    {
        //第一步，拆分数据
        //key保存字段，value保存值
        var key=new Array()
        var value=new Array()
        for(var i in data)
        {
            key.push(i)
            value.push(data[i])
        }

        //第二步，构造占位符,并生成对应sql字符串
        var key_mark=new Array()
        var value_mark=new Array()
        for(var i=0;i<key.length;i++)
        {
            key_mark.push('??')
            value_mark.push('?')
        }
        var key_string=key_mark.join(',')
        var value_string=value_mark.join(',')

        //生成sql语句
        var insert_str='INSERT INTO ?? ('+key_mark+')'+' VALUES('+value_mark+')'
        var params=key.concat(value)
         params.unshift(table)
        //返回数据，array[0]=insert_str||array[1]=params
        return [insert_str,params]

    }
    /*删*/
    /*查*/

    //condition为查询所需的条件
    query_c(table,key,condition,limit){
        //SELECT (key) from table WHERE condition
        //第一步，拆分数据
        var condition_key=new Array()
        var conditions=new Array()
        var condition_mark=new Array()
        var query_string=null
        var params=[]
        var key_string=key.join(',')

    if(condition){
        for (var i in condition) {
            condition_key.push(i)
            conditions.push(i)
            conditions.push(condition[i])
            condition_mark.push("??=?")
        }

        var condition_string=condition_mark.join(" AND ")
        params=conditions


         query_string='SELECT '+key_string+' FROM ?? '+'WHERE '+condition_string
    }
    else{
        query_string='SELECT '+key_string+''+' FROM ?? '
    }
    if(limit)
    {
        query_string=query_string+' LIMIT ?,?'
        params.push(limit.start)
        params.push(limit.end)
    }
        params.unshift(table)
        return [query_string,params]
        //布置占位符
    }

    /*模糊查询
    * likes:字典格式{name:string,name:string}*/
    query_like(table,keys,likes){
        //SELECT keys FROM table WHERE likes
        let key_str=[]
        let key_val=[]
        for(let i in keys){
            key_str.push("??")
            key_val.push(keys[i])
        }
        let like_str=[]
        let like_val=[]
        for(let i in likes){
            like_str.push("??=?")
            like_val.push(i)
            like_val.push(likes[i])
        }
        let sql_str="SELECT "+key_str.join(',')+" FROM ?? WHERE "+like_str.join(" OR ")
        let params=key_val.concat(table).concat(like_val)
        return [sql_str,params]
    }


    //多表联查
    query_multiple(tableA,tableB,akey,bkey,condition_on,condition_where,limit){
        //SELECT tableA.KEY,tableB.KEY FROM tableA inner join tableB on condition
        let akey_val=new Array()
        let bkey_val=new Array()
        let cd_onval=new Array()
        let cd_wheval=new Array()
        let keys=new Array()
        let cd_ons=new Array()
        let cd_whes=new Array()
        for(let i in akey)
        {
            keys.push("??")
            akey_val.push(tableA+'.'+akey[i])
        }
        for(let i in bkey)
        {
            keys.push("??")
            bkey_val.push(tableB+'.'+bkey[i])
        }
        for(let i in condition_on)
        {
            cd_ons.push("??=??")
            cd_onval.push(tableA+'.'+i)
            cd_onval.push(tableB+'.'+condition_on[i])
        }

        let key_str=keys.join(',')
        let cd_ons_str=cd_ons.join(' AND ')
        let sql_str="SELECT "+key_str+" FROM "+tableA+" INNER JOIN "+tableB+" ON "+cd_ons_str
        let params=akey_val.concat(bkey_val).concat(cd_onval)
        if(condition_where){
            for(let i in condition_where)
            {
                cd_whes.push("??=?")
                cd_wheval.push(tableA+'.'+i)
                cd_wheval.push(condition_where[i])
            }
        let cd_whes_str=cd_whes.join(' AND ')
            sql_str=sql_str+" WHERE "+cd_whes_str
            params=params.concat(cd_wheval)
        }
        if(limit)
        {
            sql_str=sql_str+"  LIMIT "+limit.start+","+limit.end
        }
        return [sql_str,params]

    }


    /*三表联查*/
    query_multiple3(tableA,tableB,tableC,akeys,bkeys,ckeys,conAB,conBC,cwhA,cwhB,cwhC,limit){
        //SELECT table.keys FROM tableA INNER JOIN tableB ON conAB INNER JION tableC WHERE cwhA
        let keys_val=[]
        let keys=[]
        //处理字段名列表
        for(let i in akeys){
            keys.push("??")
            keys_val.push(tableA+'.'+akeys[i])
        }
        for(let i in bkeys){
            keys.push("??")
            keys_val.push(tableB+'.'+bkeys[i])
        }
        for(let i in ckeys){
            keys.push("??")
            keys_val.push(tableC+'.'+ckeys[i])
        }
        //处理两个ON的条件
        let conAB_str=[]
        let conBC_str=[]
        let con_val=[]
        for(let i in conAB){
            conAB_str.push("??=??")
            con_val.push(tableA+'.'+i)
            con_val.push(tableB+'.'+conAB[i])
        }
        for(let i in conBC){
            conBC_str.push("??=??")
            con_val.push(tableB+'.'+i)
            con_val.push(tableC+'.'+conBC[i])
        }
        let cd_str=[]
        let cd_val=[]
        if(cwhA){
            for(let i in cwhA){
            cd_str.push("??=?")
            cd_val.push(tableA+'.'+i)
            cd_val.push(cwhA[i])
            }
        }
        if(cwhB){
            for(let i in cwhB){
            cd_str.push("??=?")
            cd_val.push(tableB+'.'+i)
            cd_val.push(cwhB[i])
            }
        }
        if(cwhC){
            for(let i in cwhC){
            cd_str.push("??=?")
            cd_val.push(tableC+'.'+i)
            cd_val.push(cwhC[i])
            }
        }

        let sql_str="SELECT "+keys.join(',')+" FROM "+tableA+
            " INNER JOIN "+tableB+" ON "+conAB_str.join(' AND ')+
            " INNER JOIN "+tableC+" ON "+conBC_str.join(' AND ')+
            " WHERE "+cd_str.join(' AND ')
        if(limit)
        {
            sql_str=sql_str+"  LIMIT "+limit.start+","+limit.end
        }
        let params=keys_val.concat(con_val).concat(cd_val)

        return [sql_str,params]

    }
    /*改*/
    update(table,data,condition){
        //table:表名
        //data：字典格式数组，key：value
        //condition:字典格式数组 key：value  指定的条件
        //UPDATE table SET data WHERE condition

        //拆分data,condition
        var data_string=new Array()
        var data_mark=new Array()
        for(var i in data)
        {   data_mark.push('??=?')
            data_string.push(i)
            data_string.push(data[i])
        }
       var condition_string=new Array()
        var condition_mark=new Array()
        for(var i in condition)
        {
            condition_mark.push('??=?')
            condition_string.push(i)
            condition_string.push(condition[i])
        }
        condition_mark=condition_mark.join(' AND ')
        var sql_string='UPDATE ?? SET '+data_mark+' WHERE '+condition_mark
        var params=data_string.concat(condition_string)
        params.unshift(table)
        return [sql_string,params]
    }

    delete(table,condition){
        //delete from table where condition
        let condition_str=[]
        let condition_val=[]
        for(let i in condition){
            condition_str.push("??=?")
            condition_val.push(i)
            condition_val.push(condition[i])
        }
        let sql_str="DELETE FROM ?? WHERE "+condition_str.join(' AND ')
        condition_val.unshift(table)

        return [sql_str,condition_val]
    }
}

module.exports=database_interface
