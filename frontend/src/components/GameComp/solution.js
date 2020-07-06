

function abhi(data, board_size){
    return 1;
    console.log(data);
    if(data.length < board_size*board_size)
        return 0;
    var double_dim_data = [];
    let holder = [];
    for(let i=0;i<data.length;i++){
        holder.push(data[i]);
        if((i+1)%board_size === 0){
            double_dim_data.push(holder);
            holder = [];
        }
    }
    console.log(double_dim_data);
    for(let i=0;i<board_size;i++){
        let hash_map= {};
        for(let j=0;j<board_size;j++){
            if(hash_map[double_dim_data[i][j]] === 1)
                return 0;
            else
                hash_map[double_dim_data[i][j]] = 1;
        }
    }
    for(let i=0;i<board_size;i++){
        let hash_map={};
        for(let j=0;j<board_size;j++){
            if(hash_map[double_dim_data[j][i]] === 1)
                return 0;
            else
                hash_map[double_dim_data[j][i]] = 1;
        }
    }
    for(let i=0;i<=board_size-3;i++){
        for(let j=0;j<=board_size-3;j++){
            let hash_map={};
            for(let x=i;x<i+3;x++){
                for(let y=j;y<j+3;y++){
                    if(hash_map[double_dim_data[x][y]] === 1)
                        return 0;
                    else
                        hash_map[double_dim_data[x][y]] = 1;
                }
            }
        }
    }
    return 1;
}


module.exports={
    abhi
}